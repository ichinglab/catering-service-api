const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // Home / Landing Page
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/order', component: () => import('pages/orderNow.vue') },
      { path: '/draft', component: () => import('pages/draftPage.vue') },
      { path: '/cart', component: () => import('pages/cartPage.vue') },

      // Authentication
      { path: '/login', component: () => import('src/pages/LoginPage.vue') },
      {
        path: '/register',
        component: () => import('src/pages/RegisterPage.vue'),
      },
      // products
      {
        path: '/product/:id',
        component: () => import('pages/SingleProduct.vue'),
      },

      // Services
      { path: '/services', component: () => import('pages/ourService.vue') },

      // Booking & Billing
      { path: '/booking', component: () => import('pages/booking.vue') },
      { path: '/billing', component: () => import('pages/billingPage.vue') },

      // Reports
      { path: '/report', component: () => import('pages/reportsPage.vue') },
    ],
  },

  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      // Home / Landing Page
      {
        path: '/dashboard',
        component: () => import('pages/Admin/dashboardPage.vue'),
      },
      {
        path: '/add-service',
        component: () => import('pages/Admin/Service/AddService.vue'),
      },
      {
        path: '/all-services',
        component: () => import('pages/Admin/Service/ServiceList.vue'),
      },

      {
        path: '/orders',
        component: () => import('pages/Admin/OrderPage.vue'),
      },
      {
        path: '/productsList',
        component: () => import('pages/Admin/ProductList.vue'),
      },

      //add category
      {
        path: '/add-category',
        component: () => import('pages/Admin/Category/AddCategory.vue'),
      },
      {
        path: '/categories',
        component: () => import('pages/Admin/Category/CategoryList.vue'),
      },
      {
        path: '/add-category/:id',
        component: () => import('pages/Admin/Category/AddCategory.vue'),
      },

      //add product
      {
        path: '/add-product',
        component: () => import('pages/Admin/Product/AddProduct.vue'),
      },
      {
        path: '/products',
        component: () => import('pages/Admin/Product/ProductList.vue'),
      },

      {
        path: '/userList',
        component: () => import('pages/Admin/UserList.vue'),
      },
    ],
  },

  // Catch-all 404 page
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
