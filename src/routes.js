import React from 'react';

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const User_Index = React.lazy(() => import('./views/pages/admin/users/User_Index'));
const User_Add = React.lazy(() => import('./views/pages/admin/users/User_Add'));
const User_Edit = React.lazy(() => import('./views/pages/admin/users/User_Edit'));

const User_Groups_Index = React.lazy(() => import('./views/pages/admin/user_groups/User_Groups_Index'));
const User_Groups_Add = React.lazy(() => import('./views/pages/admin/user_groups/User_Groups_Add'));
const User_Groups_Edit = React.lazy(() => import('./views/pages/admin/user_groups/User_Groups_Edit'));

const System_Modules_Index = React.lazy(() => import('./views/pages/admin/system_modules/System_Modules_Index'));
const System_Modules_Add = React.lazy(() => import('./views/pages/admin/system_modules/System_Modules_Add'));
const System_Modules_Edit = React.lazy(() => import('./views/pages/admin/system_modules/System_Modules_Edit'));

const CMS_Page_Add = React.lazy(() => import('./views/pages/admin/Cms_Pages/Cms_Pages_Add'));
const CMS_Page_Index = React.lazy(() => import('./views/pages/admin/Cms_Pages/Cms_Pages_Index'));
const CMS_Page_Edit = React.lazy(() => import('./views/pages/admin/Cms_Pages/Cms_Pages_Edit'));
const CMS_Page_Detail = React.lazy(() => import('./views/pages/admin/Cms_Pages/Cms_Pages_Detail'));

//Import file for Menu Management

const Menu_Management_Index = React.lazy(() => import('./views/pages/admin/menu_management/Menu_Management_Index'));
const Menu_Management_Add = React.lazy(() => import('./views/pages/admin/menu_management/Menu_Management_Add'));
const Menu_Management_Edit = React.lazy(() => import('./views/pages/admin/menu_management/Menu_Management_Edit'));

// Import File for menu items
const Menu_Items_Add = React.lazy(() => import('./views/pages/admin/menu_items_management/Menu_Items_Add'));
const Menu_Items_Index = React.lazy(() => import('./views/pages/admin/menu_items_management/Menu_Items_Index'));
const Menu_Items_Edit = React.lazy(() => import('./views/pages/admin/menu_items_management/Menu_Items_Edit'));

// Import File Banner Management

const Banner_Management_Add = React.lazy(() => import('./views/pages/admin/banner_management/Banner_Management_Add'));
const Banner_Management_Index = React.lazy(() => import('./views/pages/admin/banner_management/Banner_Management_Index'));
const Banner_Management_Edit = React.lazy(() => import('./views/pages/admin/banner_management/Banner_Management_Edit'));


// Import File Site Setting

//const Site_Setting_Add = React.lazy(() => import('./views/pages/admin/site_settings/Site_Setting_Add'));
// const Site_Setting_Index = React.lazy(() => import('./views/pages/admin/site_settings/Site_Setting_Index'));
//const Site_Setting_Add = React.lazy(() => import('./views/pages/admin/site_settings/Site_Setting_Add'));
//const Site_Setting_Index = React.lazy(() => import('./views/pages/admin/site_settings/Site_Setting_Index'));

const Site_Setting_Edit = React.lazy(() => import('./views/pages/admin/site_settings/Site_Setting_Edit'));

const User_Myprofile = React.lazy(() => import('./views/pages/admin/users/User_Myprofile'));





const routes = [
  { path: '/admin', exact: true, name: 'Home' },
  { path: '/admin/dashboard', name: 'Dashboard', component: Dashboard },

  // module_name and action parameter used for ACL mechanisam its required column
  { path: '/admin/users', exact: true, name: 'Users Management', component: User_Index, module_name: 'users', action: 'view' },
  { path: '/admin/users/add', exact: true, name: 'Add', component: User_Add, module_name: 'users', action: 'create' },
  { path: '/admin/users/edit/:id', exact: true, name: 'Edit', component: User_Edit, module_name: 'users', action: 'update' },
  { path: '/admin/my-profile', exact: true, name: 'My Profile', component: User_Myprofile},

  // module_name and action parameter used for ACL mechanisam its required column
  { path: '/admin/user_groups', exact: true, name: 'Groups Management', component: User_Groups_Index, module_name: 'user_groups', action: 'view' },
  { path: '/admin/user_groups/add', exact: true, name: 'Add', component: User_Groups_Add, module_name: 'user_groups', action: 'create' },
  { path: '/admin/user_groups/edit/:id', exact: true, name: 'Edit', component: User_Groups_Edit, module_name: 'user_groups', action: 'update' },

  //This is a core module its only access Super User
  { path: '/admin/system_modules', exact: true, name: 'Module Management', component: System_Modules_Index, module_name: 'system_modules', action: 'view'},
  { path: '/admin/system_modules/add', exact: true, name: 'Add', component: System_Modules_Add, module_name: 'system_modules', action: 'view' },
  { path: '/admin/system_modules/edit/:id', exact: true, name: 'Edit', component: System_Modules_Edit, module_name: 'system_modules', action: 'view' },

   //This is a core module its only access Super User
  { path: '/admin/cms_pages', exact: true, name: 'Pages ', component: CMS_Page_Index, module_name: 'cms_pages', action: 'view' },
  { path: '/admin/cms_pages/add', exact: true, name: 'Add ', component: CMS_Page_Add, module_name: 'cms_pages', action: 'create' },
  { path: '/admin/cms_pages/edit/:id', exact: true, name: '  Edit', component: CMS_Page_Edit, module_name: 'cms_pages', action: 'update' },
  { path: '/admin/cms_pages/detailview/:id', exact: true, name: 'DetailView', component: CMS_Page_Detail, module_name: 'cms_pages', action: 'view' },


  //  module_name and action parameter used for ACL mechanisam its required column menu management 
  { path: '/admin/menu_management', exact: true, name: 'Menu', component: Menu_Management_Index, module_name: 'menu_management', action: 'view' },
  { path: '/admin/menu_management/add', exact: true, name: 'Add', component: Menu_Management_Add, module_name: 'menu_management', action: 'create' },
  { path: '/admin/menu_management/edit/:id', exact: true, name: 'Edit', component: Menu_Management_Edit, module_name: 'menu_management', action: 'update' },

  //  module_name and action parameter used for ACL mechanisam its required column menu management 
  { path: '/admin/menu_management/menu_items/:id', exact: true,  name: 'Menu Items Management', component: Menu_Items_Index,module_name:'menu_management',action:'menumanage' },
  { path: '/admin/menu_management/menu_items/add/:id', exact: true,  name: 'Add Menu Items', component: Menu_Items_Add, module_name:'menu_management',action:'menumanage' },
  { path: '/admin/menu_management/menu_items/edit/:category_id/:id', exact: true,  name: 'Edit Menu Items ', component: Menu_Items_Edit, module_name:'menu_management',action:'menumanage'},

   //  module_name and action parameter used for ACL mechanisam its required column Banner  management 
   { path: '/admin/banner_management', exact: true,  name: 'Banner', component: Banner_Management_Index,module_name:'banner_management',action:'view' },
   { path: '/admin/banner_management/add', exact: true,  name: 'Add', component: Banner_Management_Add, module_name:'banner_management',action:'create' },
   { path: '/admin/banner_management/edit/:id', exact: true,  name: 'Edit', component: Banner_Management_Edit, module_name:'banner_management',action:'update'},

  //  module_name and action parameter used for ACL mechanisam its required column Site setting

 // { path: '/admin/site_setting', exact: true,  name: 'Site Setting', component: Site_Setting_Index,module_name:'site_setting',action:'view' },
  //{ path: '/admin/site_setting/add', exact: true,  name: 'Add', component: Site_Setting_Add, module_name:'site_setting',action:'create' },
  { path: '/admin/theme_setting', exact: true,  name: 'Theme Setting', component: Site_Setting_Edit, module_name:'theme_setting',action:'view'},

];

export default routes;
