const Koa           = require('koa');
const Router        = require('koa-router');
const bodyParser    = require('koa-bodyparser');
const serve         = require('koa-static');
const logger        = require('koa-logger');

const passport      = require('koa-passport');
const LocalStrategy = require('passport-local');
const JwtStrategy   = require('passport-jwt').Strategy;
const ExtractJwt    = require('passport-jwt').ExtractJwt;

const jwtsecret     = "mysecretkey";
const jwt           = require('jsonwebtoken');
const socketIO      = require('socket.io');
const socketioJwt   = require('socketio-jwt');

const mongoose      = require('mongoose');
const crypto        = require('crypto');

const cors          = require('koa-cors');
const app           = new Koa();
const router        = new Router();


app.use(cors());
app.use(serve('public'));
app.use(logger());
app.use(bodyParser());
app.use(passport.initialize());
app.use(router.routes());

const server = app.listen(3000);

// mongo

mongoose.Promise = Promise;
mongoose.set('debug', true);
mongoose.connect('mongodb://localhost/test');
mongoose.connection.on('error', console.error);

const uniqueArrayPlugin = require('mongoose-unique-array');


//---------User Schema------------//

const userSchema = new mongoose.Schema({
  displayName: String,
  email: {
    type: String,
    required: 'e-mail is required',
    unique: 'this e-mail already exist'
  },
  passwordHash: String,
  salt: String,
  name: String,
  lastName: String,
  phone: String,
  position: String,
  role: String,
  active: Boolean,
  note: String,
  deleted: Boolean
}, {
  timestamps: true
});

userSchema.virtual('password')
.set(function (password) {
  this._plainPassword = password;
  if (password) {
    this.salt = crypto.randomBytes(128).toString('base64');
    this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1');
  } else {
    this.salt = undefined;
    this.passwordHash = undefined;
  }
})
.get(function () {
  return this._plainPassword;
});

userSchema.methods.checkPassword = function (password) {
  if (!password) return false;
  if (!this.passwordHash) return false;
  return crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1') == this.passwordHash;
};

const User = mongoose.model('User', userSchema);

//---------Task Schema------------//

const taskSchema = new mongoose.Schema({
  title: String,
  creator: String,
  creator_id: String,
  maker: String,
  maker_id: String,
  deadLine: String,
  priority: Number,
  active: Boolean,
  comments: Array,
  description: String,

}, {
  timestamps: true
});

// taskSchema.plugin(uniqueArrayPlugin);

const Task = mongoose.model('Task', taskSchema);

//----------Passport--------------//

// Local

passport.use(new LocalStrategy({
    usernameField: 'displayName',
    passwordField: 'password',
    session: false
  },
  function (displayName, password, done) {
    User.findOne({displayName}, (err, user) => {
      if (err) {
        return done(err);
      }

      if (!user || !user.checkPassword(password)) {
        return done(null, false, {message: 'User does not exist or wrong password.'});
      }
      return done(null, user);
    });
  })
);

// JWT

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  secretOrKey: jwtsecret
};

passport.use(new JwtStrategy(jwtOptions, function (payload, done) {

  User.findById(payload.id, (err, user) => {
    if (err) {
      return done(err)
    }
    if (user) {
      done(null, user)
    } else {
      done(null, false)
    }
  })

}));

//------------Routing User---------------//

// new user route

router.post('/user', async (ctx, next) => {

  await passport.authenticate('jwt', async function (err, user) {

    if (user) {
      try {
        ctx.body = await User.create(ctx.request.body);
      }
      catch (err) {
        ctx.status = 400;
        ctx.body = err;
      }
    } else {
      ctx.body = "No such user";
      console.log("err", err)
    }
  })(ctx, next)

});

router.post('/user/createAdmin', async(ctx, next) => {

  try {
    ctx.body = await User.create(ctx.request.body);
  }
  catch (err) {
    ctx.status = 400;
    ctx.body = err;
  }

});

// local auth route. Creates JWT is successful

router.post('/login', async(ctx, next) => {

  await passport.authenticate('local', function (err, user) {

    if (user == false) {
      console.log("IF")

      ctx.body = "Login failed";
    } else {
      console.log("ELSE")
      const payload = {
        id: user.id,
        displayName: user.displayName,
        email: user.email
      };
      const token = jwt.sign(payload, jwtsecret); 

      ctx.body = {user: user.displayName, token: 'JWT ' + token};
    }
  })(ctx, next);

});

// Userlist

router.get('/user', async (ctx, next) => {

  await passport.authenticate('jwt', async function (err, user) {

    if (user) {
      try {
        ctx.body = await User.find(ctx.request.body);
      }
      catch (err) {
        ctx.status = 400;
        ctx.body = err;
      }
    } else {
      ctx.body = "No such user";
      console.log("err", err)
    }
  })(ctx, next)

});

// Get user by ID

router.get('/user/:id', async (ctx, next) => {

  await passport.authenticate('jwt', async function (err, user) {

    if (user) {
      try {
        let obj = await User.findById(ctx.params.id);
        let responseObj = {
          _id:         obj._id,
          displayName: obj.displayName,
          email:       obj.email,
          name:        obj.name,
          lastName:    obj.lastName,
          phone:       obj.phone,
          position:    obj.position,
          role:        obj.role,
          active:      obj.active,
          updatedAt:   obj.updatedAt,
        };
        ctx.body = responseObj
      }
      catch (err) {
        ctx.status = 400;
        ctx.body = err;
      }
    } else {
      ctx.body = "No such user";
      console.log("err", err)
    }
  })(ctx, next)

});

// Save user by ID

router.put('/user/:id', async (ctx, next) => {
 
  await passport.authenticate('jwt', async function (err, user) {

    if (user) {
      try {

        console.log('BODY')
        console.log(ctx.request.body)

        ctx.body = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body);
      }
      catch (err) {
        ctx.status = 400;
        ctx.body = err;
      }
    } else {
      ctx.body = "No such user";
      console.log("err", err)
    }
  })(ctx, next)

});

// check admin

router.get('/login/checkadmin', async (ctx, next) => {

  await User.findOne({ displayName: 'admin' }, (err, user) => {

    if (err) ctx.body = err;

    if (!user) {
      ctx.body = "false";
    } else {
      ctx.body = "true";
    }
  });

});

// delete user by id

router.delete('/user/:id', async (ctx, next) => {

  await passport.authenticate('jwt', async function (err, user) {

    if (user) {
      try {
        ctx.body = await User.findByIdAndUpdate(ctx.params.id, { deleted: true });
      }
      catch (err) {
        ctx.status = 400;
        ctx.body = err;
      }
    } else {
      ctx.body = "No such user";
      console.log("err", err)
    }
  })(ctx, next)

});

//----------Routing Task--------//

// task list

router.get('/task', async (ctx, next) => {

  await passport.authenticate('jwt', async function (err, user) {

    if (user) {
      try {
        let obj = await Task.find(ctx.request.body);
        // obj.commentCount = obj.comments.length
        ctx.body = obj
      }
      catch (err) {
        ctx.status = 400;
        ctx.body = err;
      }
    } else {
      ctx.body = "No such user";
      console.log("err", err)
    }
  })(ctx, next)

});

// create task

router.post('/task', async (ctx, next) => {

  await passport.authenticate('jwt', async function (err, user) {

    if (user) {
      try {
        ctx.request.body.creator_id = user._id 
        ctx.request.body.creator = user.name + ' ' + user.lastName
        ctx.body = await Task.create(ctx.request.body);
      }
      catch (err) {
        ctx.status = 400;
        ctx.body = err;
      }
    } else {
      ctx.body = "No such user";
      console.log("err", err)
    }
  })(ctx, next)

});

// Get task by ID

router.get('/task/:id', async (ctx, next) => {

  await passport.authenticate('jwt', async function (err, user) {

    if (user) {
      try {
        ctx.body = await Task.findById(ctx.params.id);
      }
      catch (err) {
        ctx.status = 400;
        ctx.body = err;
      }
    } else {
      ctx.body = "No such user";
      console.log("err", err)
    }
  })(ctx, next)

});

// add comment

router.post('/task/comment/:id', async (ctx, next) => {

  await passport.authenticate('jwt', async function (err, user) {

    if (user) {
      try {
        ctx.request.body.creator_id = user._id
        ctx.request.body.creator = user.name + ' ' + user.lastName
        ctx.request.body.addedAt = Date.now()

        let comment = ctx.request.body
      
        console.log("comments")
        console.log(comment)

        ctx.body = await Task.findByIdAndUpdate(ctx.params.id, { $push: { 'comments': comment } } );
      }
      catch (err) {
        ctx.status = 400;
        ctx.body = err;
      }
    } else {
      ctx.body = "No such user";
      console.log("err", err)
    }
  })(ctx, next)

});


//---Socket Communication-----//

let io = socketIO(server).listen(9999);

io.on('connection', () => {

  socketioJwt.authorize({
    secret: jwtsecret,
    timeout: 15000
  })
  


}).on('authenticated', (socket) => {

  console.log('this is the name from the JWT: ' + socket.decoded_token.displayName);

  socket.on("clientEvent", (data) => {
    console.log(data);
  })
}).on('login', (socket) => {

  console.log('LOGINED')
});
