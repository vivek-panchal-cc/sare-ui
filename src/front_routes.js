import React from 'react';

const Index = React.lazy(() => import('./views/pages/frontend/index'));
const Cms_pages = React.lazy(() => import('./views/pages/frontend/cms_pages'));
const KycIndex = React.lazy(() => import('./views/pages/frontend/kyc/KycIndex'));
const KycUpload = React.lazy(() => import('./views/pages/frontend/kyc/KycUpload'));

const routes = [
  // { path: '/', exact: true, name: 'Home' },
  { path: '/', exact: true, name: 'Landing', component: Index },
  { path: '/info/:cms_slug', exact: true, name: 'Cms Pages', component: Cms_pages },
  { path: '/kyc/:mobile', exact: true, name: 'Kyc', component: KycIndex },
  { path: '/kyc/:mobile/:secret_key', exact: true, name: 'KycUpload', component: KycUpload },
];

export default routes;
