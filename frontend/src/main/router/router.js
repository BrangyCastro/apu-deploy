import { lazy } from "react";

const Home = lazy(() => import("../../presentation/pages/general/home/Home"));
const Reports = lazy(() =>
  import("../../presentation/pages/general/teacher/reports/Reports")
);
const ReportsDetails = lazy(() =>
  import("../../presentation/pages/general/teacher/reports/ReportsDetails")
);
const Budget = lazy(() => import("../../presentation/pages/budget/Budget"));
const Information = lazy(() =>
  import("../../presentation/pages/information/Information")
);
const Profile = lazy(() => import("../../presentation/pages/profile/Profile"));
const Vendors = lazy(() =>
  import("../../presentation/pages/general/convention/vendors/Vendors")
);
const VendorsDetails = lazy(() =>
  import("../../presentation/pages/general/convention/vendors/VendorsDetails")
);
const Promotions = lazy(() =>
  import("../../presentation/pages/general/convention/promotions/Promotions")
);
const PromotionsDetails = lazy(() =>
  import(
    "../../presentation/pages/general/convention/promotions/PromotionsDeatils"
  )
);
const Extension = lazy(() =>
  import("../../presentation/pages/general/extension/Extension")
);
const MaintenanceUsers = lazy(() =>
  import("../../presentation/pages/admin/maintenance/users/Users")
);
const MaintenanceUsersDetails = lazy(() =>
  import("../../presentation/pages/admin/maintenance/users/UserDetails")
);
const MaintenanceVendors = lazy(() =>
  import("../../presentation/pages/admin/maintenance/vendors/Vendors")
);
const MaintenanceVendorsDetails = lazy(() =>
  import("../../presentation/pages/admin/maintenance/vendors/VendorsDetails")
);
const MaintenancePromotions = lazy(() =>
  import("../../presentation/pages/admin/maintenance/promotions/Promotions")
);
const MaintenancePromotionsDetails = lazy(() =>
  import(
    "../../presentation/pages/admin/maintenance/promotions/PromotionsDetails"
  )
);
const MaintenanceExtension = lazy(() =>
  import("../../presentation/pages/admin/maintenance/extension/Extension")
);
const MaintenanceExtensionDetails = lazy(() =>
  import(
    "../../presentation/pages/admin/maintenance/extension/ExtensionDetails"
  )
);

const Payroll = lazy(() =>
  import("../../presentation/pages/admin/payments/payroll/Payroll")
);
const PayrollDetails = lazy(() =>
  import("../../presentation/pages/admin/payments/payroll/PayrollDetails")
);
const PayrollNew = lazy(() =>
  import("../../presentation/pages/admin/payments/payroll/PayrollNew")
);
const PayrollSingle = lazy(() =>
  import("../../presentation/pages/admin/payments/payroll/PayrollSingle")
);

const HumanTalent = lazy(() =>
  import("../../presentation/pages/admin/payments/human-talent/HumanTalent")
);
const HumanTalentNew = lazy(() =>
  import("../../presentation/pages/admin/payments/human-talent/HumanTalentNew")
);
const HumanTalentPay = lazy(() =>
  import("../../presentation/pages/admin/payments/human-talent/HumanTalentPay")
);
const HumanTalentDetails = lazy(() =>
  import(
    "../../presentation/pages/admin/payments/human-talent/HumanTalentDetails"
  )
);
const HumanTalentSaleDetails = lazy(() =>
  import(
    "../../presentation/pages/admin/payments/human-talent/HumanTalentSaleDetails"
  )
);

const MultiplePayments = lazy(() =>
  import(
    "../../presentation/pages/admin/payments/multiple-payments/MultiplePayments"
  )
);

const GenerateCharges = lazy(() =>
  import("../../presentation/pages/admin/generate-charges/GenerateCharges")
);

const OthersFaculty = lazy(() =>
  import("../../presentation/pages/admin/others/faculty/Faculty")
);
const OthersBudget = lazy(() =>
  import("../../presentation/pages/admin/others/budget/Budget")
);
const OthersInformation = lazy(() =>
  import("../../presentation/pages/admin/others/information/Information")
);

const MyCompanies = lazy(() =>
  import("../../presentation/pages/supplier/my-companies/MyCompanies")
);
const MyCompaniesDetails = lazy(() =>
  import("../../presentation/pages/supplier/my-companies/MyCompaniesDetails")
);
const MyPromotions = lazy(() =>
  import("../../presentation/pages/supplier/my-promotions/MyPromotions")
);
const MyPromotionsNew = lazy(() =>
  import("../../presentation/pages/supplier/my-promotions/MyPromotionsNew")
);
const MyPromotionsDetails = lazy(() =>
  import("../../presentation/pages/supplier/my-promotions/MyPromotionsDetails")
);
const Affiliates = lazy(() =>
  import("../../presentation/pages/supplier/affiliates/Affiliates")
);
const AfiliatesDetails = lazy(() =>
  import("../../presentation/pages/supplier/affiliates/AfiliatesDetails")
);

export const _routesComun = [
  { path: "/", exact: true, name: "Inicio", component: Home },
  { path: "/perfil", name: "Perfil", exact: true, component: Profile },
];

export const _routesGeneral = [
  { path: "/reportes", name: "Reportes", exact: true, component: Reports },
  {
    path: "/reportes/:id",
    name: "Detalle",
    exact: true,
    component: ReportsDetails,
  },
  {
    path: "/presupuesto",
    name: "Presupuesto anueles",
    exact: true,
    component: Budget,
  },
  {
    path: "/informes",
    name: "Informes de gestión",
    exact: true,
    component: Information,
  },
  {
    path: "/proveedores",
    name: "Proveedores",
    exact: true,
    component: Vendors,
  },
  {
    path: "/proveedores/:id",
    name: "Detalle",
    exact: true,
    component: VendorsDetails,
  },
  {
    path: "/promociones",
    name: "Promociones",
    exact: true,
    component: Promotions,
  },
  {
    path: "/promociones/:id",
    name: "Detalle",
    exact: true,
    component: PromotionsDetails,
  },
  { path: "/extension", name: "Extensiones", component: Extension },
];

export const _routesAdmin = [
  {
    path: "/mantenimiento/usuarios",
    name: "Usuarios",
    exact: true,
    component: MaintenanceUsers,
  },
  {
    path: "/mantenimiento/usuarios/:id",
    name: "Detalle",
    exact: true,
    component: MaintenanceUsersDetails,
  },
  {
    path: "/mantenimiento/proveedores",
    name: "Proveedores",
    exact: true,
    component: MaintenanceVendors,
  },
  {
    path: "/mantenimiento/proveedores/:id",
    name: "Detalle",
    exact: true,
    component: MaintenanceVendorsDetails,
  },
  {
    path: "/mantenimiento/promociones",
    name: "Promociones",
    exact: true,
    component: MaintenancePromotions,
  },
  {
    path: "/mantenimiento/promociones/:id",
    name: "Detalle",
    exact: true,
    component: MaintenancePromotionsDetails,
  },
  {
    path: "/mantenimiento/extensiones",
    name: "Extensiones",
    exact: true,
    component: MaintenanceExtension,
  },
  {
    path: "/mantenimiento/extensiones/:id",
    name: "Detalle",
    exact: true,
    component: MaintenanceExtensionDetails,
  },
  {
    path: "/pagos/nomina",
    name: "Nómina",
    exact: true,
    component: Payroll,
  },
  {
    path: "/pagos/nomina/nuevo-csv",
    name: "Nueva Nómina CSV",
    exact: true,
    component: PayrollNew,
  },
  {
    path: "/pagos/nomina/nuevo",
    name: "Nueva Nómina Inidividual",
    exact: true,
    component: PayrollSingle,
  },
  {
    path: "/pagos/nomina/:id",
    name: "Detalle",
    exact: true,
    component: PayrollDetails,
  },
  {
    path: "/pagos/talento-humano",
    name: "Talento Humano",
    exact: true,
    component: HumanTalent,
  },
  {
    path: "/pagos/talento-humano/nuevo-csv",
    name: "Nuevo T. Humano CSV",
    exact: true,
    component: HumanTalentNew,
  },
  {
    path: "/pagos/talento-humano/descuento-csv",
    name: "Lista de descunto T. Humano CSV",
    exact: true,
    component: HumanTalentPay,
  },
  {
    path: "/pagos/talento-humano/apu/:id",
    name: "Detalle",
    exact: true,
    component: HumanTalentDetails,
  },
  {
    path: "/pagos/talento-humano/venta/:id",
    name: "Detalle final",
    exact: true,
    component: HumanTalentSaleDetails,
  },
  {
    path: "/pagos/pagos-varios",
    name: "Pagos Varios",
    exact: true,
    component: MultiplePayments,
  },
  {
    path: "/generar-cobros",
    name: "Generar cobros",
    exact: true,
    component: GenerateCharges,
  },
  {
    path: "/otros/facultades",
    name: "Facultades",
    exact: true,
    component: OthersFaculty,
  },
  {
    path: "/otros/presupuesto",
    name: "Presupuesto",
    exact: true,
    component: OthersBudget,
  },
  {
    path: "/otros/informe",
    name: "Informe",
    exact: true,
    component: OthersInformation,
  },
];

export const _routesProve = [
  {
    path: "/mis-companias",
    name: "Mis empresas",
    exact: true,
    component: MyCompanies,
  },
  {
    path: "/mis-companias/:id",
    name: "Detalle",
    exact: true,
    component: MyCompaniesDetails,
  },
  {
    path: "/mis-promociones",
    name: "Mis promociones",
    exact: true,
    component: MyPromotions,
  },
  {
    path: "/mis-promociones/nuevo",
    name: "Nueva promoción",
    exact: true,
    component: MyPromotionsNew,
  },
  {
    path: "/mis-promociones/:id",
    name: "Detalle",
    exact: true,
    component: MyPromotionsDetails,
  },
  {
    path: "/afiliados",
    name: "Afiliados",
    exact: true,
    component: Affiliates,
  },
  {
    path: "/afiliados/:id",
    name: "Perfil",
    exact: true,
    component: AfiliatesDetails,
  },
];
