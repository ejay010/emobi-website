import CustomerLogin from '../components/CustomerLogin.vue';
import HomePage from '../components/HomePage.vue';
import CustomerRegister from '../components/CustomerRegister.vue';

import Customer from '../components/Customer.vue';
import CustomerProfile from '../components/ProfilePage.vue';
import CustomerEvents from '../components/EventsPage.vue';
import CustomerTickets from '../components/PurchasedTickets.vue'
import EditEvent from '../components/EditEvent.vue'
import CustomerEventList from '../components/Utilities/CustomerEventList.vue'
import Qrcodereader from '../components/QrcodeReader.vue'

import EventView from '../components/EventView.vue'
import TicketManager from '../components/TicketManager.vue'

import TestComponent from '../components/Utilities/GoogleMapComponent.vue'

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
    path: '/test',
    component: TestComponent
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
    meta: { requiresAuth: true },
    children: [
      {
        path:'profile',
        name: 'CustomerProfile',
        component: CustomerProfile,
        meta: { requiresAuth: true },
      },
      {
        path:'events',
        name: 'CustomerEvents',
        component: CustomerEvents,
        meta: { requiresAuth: true },
        children: [
          {
            path:'manageTickets/:eventId',
            name: 'ManageTickets',
            component: TicketManager,
            props: true,
            meta: { requiresAuth: true },
          },
          {
            path: 'eventlist',
            name: 'CustomerEventList',
            component: CustomerEventList,
            meta: { requiresAuth: true }
          },
          {
            path: 'scanTicket',
            name: 'QrReader',
            component: Qrcodereader,
            meta: { requiresAuth: true },
          }
        ]
      },
      {
        path: 'tickets',
        name: 'CustomerTickets',
        component: CustomerTickets,
        meta: { requiresAuth: true },
      }
    ]
  },
  {
    path: '/customer/:email/edit/:eventkey',
    name: 'EditEvent',
    component: EditEvent,
    meta: { requiresAuth: true },
  },
  {
    path: '/publicEvent/:email/:eventkey',
    name: 'EventView',
    component: EventView
  }
]

export default routes;
