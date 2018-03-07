import CustomerLogin from '../components/CustomerLogin.vue';
import HomePage from '../components/HomePage.vue';
import CustomerRegister from '../components/CustomerRegister.vue';

import Customer from '../components/Customer.vue';
import CustomerProfile from '../components/ProfilePage.vue';
import CustomerEvents from '../components/EventsPage.vue';
import CustomerTickets from '../components/PurchasedTickets.vue'
import EditEvent from '../components/EditEvent.vue'

import EventView from '../components/EventView.vue'

let routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/login',
    name: 'CustomerLogin',
    component: CustomerLogin
  },
  {
    path: '/Register',
    name: 'CustomerRegister',
    component: CustomerRegister
  },
  {
    path: '/customer/:email',
    name: 'Customer',
    component: Customer,
    children: [
      {
        path:'profile',
        name: 'CustomerProfile',
        component: CustomerProfile
      },
      {
        path:'events',
        name: 'CustomerEvents',
        component: CustomerEvents
      },
      {
        path: 'tickets',
        name: 'CustomerTickets',
        component: CustomerTickets
      }
    ]
  },
  {
    path: '/customer/:email/edit/:eventkey',
    name: 'EditEvent',
    component: EditEvent
  },
  {
    path: '/publicEvent/:email/:eventkey',
    name: 'EventView',
    component: EventView
  }
]

export default routes;
