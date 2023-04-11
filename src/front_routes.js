import React from 'react';

const Index = React.lazy(() => import('./views/pages/frontend/index'));
const Cms_pages = React.lazy(() => import('./views/pages/frontend/cms_pages'));
const KycIndex = React.lazy(() => import('./views/pages/frontend/kyc/KycIndex'));
const KycUpload = React.lazy(() => import('./views/pages/frontend/kyc/KycUpload'));
const KycFailure = React.lazy(() => import('./views/pages/frontend/kyc/KycFailure'));
const KycRecieved = React.lazy(() => import('./views/pages/frontend/kyc/KycRecieved'));
const KycChecking = React.lazy(() => import('./views/pages/frontend/kyc/KycChecking'));
const KycSuccess = React.lazy(() => import('./views/pages/frontend/kyc/KycSuccess'));
const KycFail = React.lazy(() => import('./views/pages/frontend/kyc/KycFail'));
const KycForm = React.lazy(() => import('./views/pages/frontend/kyc/KycForm'));
const KycConfirmationForm = React.lazy(() => import('./views/pages/frontend/kyc/KycConfirmationForm'));
const KycValidate = React.lazy(() => import('./views/pages/frontend/kyc/KycValidate'));
const TermsConditions = React.lazy(() => import('./views/pages/frontend/kyc/Terms-Conditions'))
// const Error404 = React.lazy(() => import('./views/pages/frontend/kyc/Error404'))

const routes = [
  // { path: '/', exact: true, name: 'Home' },
  { path: '/', exact: true, name: 'Landing', component: Index },
  { path: '/info/:cms_slug', exact: true, name: 'Cms Pages', component: Cms_pages },
  { path: '/kyc/failure', exact: true, name: 'KycFailure', component: KycFailure },
  { path: '/kyc/recieved', exact: true, name: 'KycRecieved', component: KycRecieved },
  // { path: '/kyc/checking', exact: true, name: 'KycChecking', component: KycChecking},
  { path: '/kyc/success', exact: true, name: 'KycSuccess', component: KycSuccess},
  { path: '/kyc/failed', exact: true, name: 'KycFail', component: KycFail},
  { path: '/terms', exact: true, name: 'TermConditions', component: TermsConditions},
  // { path: '/kyc/404', exact: true, name: 'TermConditions', component: Error404},
  { path: '/kyc/:mobile/:secret_key', exact: true, name: 'KycChecking', component: KycChecking },
  // { path: '/kyc/:mobile/:secret_key', exact: true, name: 'KycForm', component: KycForm},
  { path: '/kyc/kycconfirmationform', exact: true, name: 'KycConfirmationForm', component: KycConfirmationForm},
  { path: '/kyc/kycValidate', exact: true, name: 'KycValidate', component: KycValidate},
  { path: '/kyc/:mobile', exact: true, name: 'Kyc', component: KycIndex },
];

export default routes;
