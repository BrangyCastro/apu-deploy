import React from "react";
import CIcon from "@coreui/icons-react";

export const _navComun = [
  {
    _tag: "CSidebarNavItem",
    name: "Inicio",
    to: "/",
    icon: <CIcon name="cil-home" customClasses="c-sidebar-nav-icon" />,
  },
];

export const _navGeneral = [
  {
    _tag: "CSidebarNavDropdown",
    name: "Docente",
    icon: "cil-folder",
    _children: [
      {
        _tag: "CSidebarNavItem",
        name: "Mis reportes",
        to: "/reportes",
        icon: "cil-file",
      },
      {
        _tag: "CSidebarNavItem",
        name: "Rol de pago",
        href: "https://apptalentohumano.uleam.edu.ec/menu/",
        target: "_blank",
        icon: "cil-link",
      },
    ],
  },
  {
    _tag: "CSidebarNavDropdown",
    name: "Convenio",
    icon: "cil-library",
    _children: [
      {
        _tag: "CSidebarNavItem",
        name: "Proveedores",
        to: "/proveedores",
        icon: "cil-building",
      },
      {
        _tag: "CSidebarNavItem",
        name: "Promociones",
        to: "/promociones",
        icon: "cil-gift",
      },
    ],
  },
  {
    _tag: "CSidebarNavItem",
    name: "Extensión",
    to: "/extension",
    icon: "cil-education",
  },
];

export const _navAdmin = [
  {
    _tag: "CSidebarNavTitle",
    _children: ["Admin"],
  },
  {
    _tag: "CSidebarNavDropdown",
    name: "Mantenimiento",
    icon: "cil-applications",
    _children: [
      {
        _tag: "CSidebarNavItem",
        name: "Usuarios",
        to: "/mantenimiento/usuarios",
        icon: "cil-people",
      },
      {
        _tag: "CSidebarNavItem",
        name: "Proveedores",
        to: "/mantenimiento/proveedores",
        icon: "cil-building",
      },
      {
        _tag: "CSidebarNavItem",
        name: "Promociones",
        to: "/mantenimiento/promociones",
        icon: "cil-gift",
      },
      {
        _tag: "CSidebarNavItem",
        name: "Extensiones",
        to: "/mantenimiento/extensiones",
        icon: "cil-education",
      },
    ],
  },
  {
    _tag: "CSidebarNavDropdown",
    name: "Pagos",
    icon: "cil-cash",
    _children: [
      {
        _tag: "CSidebarNavItem",
        name: "Nómina",
        to: "/pagos/nomina",
        icon: "cil-description",
      },
      {
        _tag: "CSidebarNavItem",
        name: "T. Humano",
        to: "/pagos/talento-humano",
        icon: "cil-description",
      },
      {
        _tag: "CSidebarNavItem",
        name: "Pagos Varios",
        to: "/pagos/pagos-varios",
        icon: "cil-dollar",
      },
    ],
  },
  {
    _tag: "CSidebarNavItem",
    name: "Generar cobros",
    to: "/generar-cobros",
    icon: "cil-calculator",
  },
  {
    _tag: "CSidebarNavDropdown",
    name: "Otros",
    icon: "cil-settings",
    _children: [
      {
        _tag: "CSidebarNavItem",
        name: "Facultades",
        to: "/otros/facultades",
        icon: "cil-education",
      },
      {
        _tag: "CSidebarNavItem",
        name: "Presupuesto",
        to: "/otros/presupuesto",
        icon: "cil-wallet",
      },
      {
        _tag: "CSidebarNavItem",
        name: "Informes",
        to: "/otros/informe",
        icon: "cil-description",
      },
    ],
  },
];

export const _navProve = [
  {
    _tag: "CSidebarNavTitle",
    _children: ["Proveedor"],
  },
  {
    _tag: "CSidebarNavItem",
    name: "Mis empresas",
    to: "/mis-companias",
    icon: "cil-building",
  },
  {
    _tag: "CSidebarNavItem",
    name: "Mis promociones",
    to: "/mis-promociones",
    icon: "cil-gift",
  },
  {
    _tag: "CSidebarNavItem",
    name: "Afiliados",
    to: "/afiliados",
    icon: "cil-people",
  },
];
