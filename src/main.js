import './assets/css/reset.css'
import './assets/css/style.css'

import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import VueSocketio from 'vue-socket.io';
import VTree from 'vue-vtree';

// Toastr

import VueToastr from '@deveodk/vue-toastr'
import '@deveodk/vue-toastr/dist/@deveodk/vue-toastr.css'

// Editor

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// Calendar

import VueTuicalendar from '@lkmadushan/vue-tuicalendar'
import 'tui-calendar/dist/tui-calendar.min.css'

// Icons Font Awesome

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
	faCoffee, 
	faBars, 
	faCog, 
	faBell, 
	faAngleDown, 
	faEllipsisV, 
	faSignOutAlt, 
	faSignInAlt, 
	faSortUp, 
	faSortDown,
	faUser,
	faHome,
	faPlus,
	faSearch,
	faPencilAlt,
	faTasks,
	faCalendarAlt,
	faUsers,
	faDollarSign,
	faFire,
	faComments,
	faChevronLeft
} from '@fortawesome/free-solid-svg-icons'

library.add(faCoffee, 
	faBars, 
	faCog, 
	faBell, 
	faAngleDown, 
	faEllipsisV, 
	faSignOutAlt, 
	faSignInAlt, 
	faSortUp, 
	faSortDown,
	faUser,
	faHome,
	faPlus,
	faSearch,
	faPencilAlt,
	faTasks,
	faCalendarAlt,
	faUsers,
	faDollarSign,
	faFire,
	faComments,
	faChevronLeft
)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

// Modifs 

Vue.filter('friendlyOnlyDate', function (value) {
	if (value) {
		return new Date(value).toLocaleString('ru', {
			year: '2-digit',
			month: 'short',
			day: 'numeric'
		});
	}
})

Vue.filter('friendlyDate', function (value) {
	if (value) {
		return new Date(value).toLocaleString('ru', {
			year: '2-digit',
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric'
		});
	}
})

Vue.filter('friendlyTime', function (value) {
	if (value) {
		return new Date(value).toLocaleString('ru', {
			hour: 'numeric',
			minute: 'numeric'
		});
	}
})

Vue.filter('priceFormat', function (value) {
	if (value) {
		return value.toFixed(2).replace(/./g, function (c, i, a) {
			return i && c !== "." && ((a.length - i) % 3 === 0) ? ' ' + c : c;
		});
	}
})

Vue.filter('striphtml', function (value) {
	let regex = /(<([^>]+)>)/ig;
	return String(value).replace(regex, " ");
});

Vue.filter('truncate', function (text, length, clamp) {  // {{data.content | truncate(300, '...')}}
	clamp = clamp || '...';
	var node = document.createElement('div');
	node.innerHTML = text;
	var content = node.textContent;
	return content.length > length ? content.slice(0, length) + clamp : content;
});

Vue.use(VueResource)
Vue.use(VueToastr, {
	defaultPosition: 'toast-top-right',
	defaultType: 'info'
})
Vue.use(VueSocketio, 'localhost:9999');
Vue.use(VueQuillEditor)
Vue.use(VueTuicalendar)
Vue.component('v-tree', VTree);


new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})