const Koa               = require('koa');
const Router            = require('koa-router');
const bodyParser        = require('koa-bodyparser');
const serve             = require('koa-static');
const logger            = require('koa-logger');

const passport          = require('koa-passport');
const LocalStrategy     = require('passport-local');
const JwtStrategy       = require('passport-jwt').Strategy;
const ExtractJwt        = require('passport-jwt').ExtractJwt;

const jwtsecret         = "mysecretkey";
const jwt               = require('jsonwebtoken');
const socketIO          = require('socket.io');
const socketioJwt       = require('socketio-jwt');
const uniqueArrayPlugin = require('mongoose-unique-array');

const mongoose          = require('mongoose');
const crypto            = require('crypto');

const cors              = require('koa-cors');
const app               = new Koa();
const router            = new Router();


app.use(cors());
app.use(serve('public'));
app.use(logger());
app.use(bodyParser());
app.use(passport.initialize());
app.use(router.routes());

const server = app.listen(3000);

// mongo

let dbUser = ''
let dbPass = ''

mongoose.Promise = Promise;
mongoose.set('debug', true);
// mongoose.connect(`mongodb://${dbUser}:${dbPass}@ds026018.mlab.com:26018/crm`, { useMongoClient: true });
mongoose.connect('mongodb://localhost/test', { useMongoClient: true });
mongoose.connection.on('error', console.error);



//---------User Schema------------//

const userSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: 'login is required',
    unique: 'this login already exist'
  },
  email: String,
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

taskSchema.plugin(uniqueArrayPlugin);

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
        if (user.active) return done(null, false, {message: 'User does not exist or wrong password.'});
        else return done(null, user);
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
      if (user.active) done(null, user)
      else done(null, false)
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

        if (err.code == 11000) ctx.body = 'login already exist' // совпадение логинов
        else ctx.body = ctx.body = 'create user error';
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

  await passport.authenticate('local', async (err, user) => {

    if (user == false) {
  
      ctx.body = "Login failed";
    } else {

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

  await passport.authenticate('jwt', async (err, user) => {

    if (user) {
      try {
        let obj = await User.find(ctx.request.body);

        if (user.role != 'admin'){
          obj = obj.map((item) => {
            let temp = {}
            temp.displayName = item.displayName
            temp.email = item.email || ''
            temp.name = item.name || ''
            temp.lastName = item.lastName || ''
            temp.phone = item.phone || ''
            temp.position = item.position || ''
            temp.role = item.role || 'user'
            temp.active = item.active || false
            temp.note = item.note || ''
            temp.deleted = item.deleted || false

            if (item.active) return temp
          })
        }

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

// Get user by ID

router.get('/user/:id', async (ctx, next) => {

  await passport.authenticate('jwt', async (err, user) => {

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
 
  await passport.authenticate('jwt', async (err, user) => {

    if (user) {
      try {
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
        let obj = await Task.find(ctx.request.body),
            users = await User.find()

        // отдаем только те где юзер исполнитель или постановщик задач

        obj = obj.map((item) => {
          
          for (let i = 0; i < users.length; i++) {
            if (users[i]._id == item.maker_id) 
              item.maker = users[i].displayName
            if (users[i]._id == item.creator_id) 
              item.creator = users[i].displayName

            user[i].commentCount = user[i].comments.length
          }
          if ( item.creator_id == user._id || item.maker_id == user._id  ) return item
        })
    
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
        let obj = await Task.findById(ctx.params.id);

        // отдаем только те где юзер исполнитель или постановщик задачи или админу

        if ( obj.maker_id = user._id || obj.creator_id || user.role == 'admin' ) {
          ctx.body = obj
        } else {
          ctx.body = 'Невозможно загрузить задачу.'
        }
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
