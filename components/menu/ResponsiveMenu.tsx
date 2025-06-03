"use client"
import * as React from "react"
import { ChevronDown, ChevronRight, ExternalLink, Menu, X } from "lucide-react"

// Types
interface BaseMenuItem {
  id: string
  title: string
  url: string
  isHighlighted?: boolean
  hasExternalLink?: boolean
}

interface MenuItem extends BaseMenuItem {
  isCollapsible?: boolean
  items?: MenuItem[]
  submenuIds?: string[]
}

interface SubMenu {
  id: string
  title: string
  url: string
  isHighlighted?: boolean
  hasExternalLink?: boolean
  items: BaseMenuItem[]
}

interface MenuData {
  title: string
  items: MenuItem[]
}

interface CollapsibleMenuItemProps {
  item: MenuItem
  level?: number
}

interface MobileMenuButtonProps {
  isOpen: boolean
  onClick: () => void
}

interface ServiciosSidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface MainContentProps {
  title?: string
  description?: string
}

// Submenús reutilizables
const subMenus: Record<string, SubMenu> = {
  componentes: {
    id: "varios",
    title: "varios",
    url: "#emergencia",
    items: [
      {
        id: "advance",
        title: "Advance",
        url: "/advance",
      },
      {
        id: "catalogo",
        title: "Catalogo",
        url: "/catalogo",
      },
      {
        id: "bomberos-emergencia",
        title: "Bomberos",
        url: "#bomberos",
      },
    ],
  },
  lugaresAgua: {
    id: "lugaresAgua",
    title: "Lugares de agua",
    url: "#lugares-agua",
    hasExternalLink: true,
    items: [
      {
        id: "pantano",
        title: "Pantano de pena",
        url: "#pantano",
      },
      {
        id: "pesquera",
        title: "La Pesquera",
        url: "#pesquera",
      },
      {
        id: "bomberos-agua",
        title: "Bomberos",
        url: "#bomberos-agua",
      },
    ],
  },
  pantanoLinks: {
    id: "pantanoLinks",
    title: "Pantano de pena",
    url: "#pantano-links",
    items: [
      {
        id: "link1",
        title: "catalogo",
        url: "/catalogo",
      },
      {
        id: "link2",
        title: "landing",
        url: "/landing",
    },
      {
        id: "link3",
        title: "advance",
        url: "/advance",
      },
      {
        id: "link4",
        title: "login",
        url: "/login",
      },
      {
        id: "link5",
        title: "ubicacion",
        url: "/ubicacion",
      },
    ],
  },
  valleAlegria: {
    id: "valleAlegria",
    title: "Valle de la alegría",
    url: "#valle-alegria",
    items: [
      {
        id: "sendero",
        title: "Sendero principal",
        url: "#sendero",
      },
      {
        id: "mirador",
        title: "Mirador norte",
        url: "#mirador",
      },
      {
        id: "camping",
        title: "Zona de camping",
        url: "#camping",
      },
      {
        id: "centro",
        title: "Centro de visitantes",
        url: "#centro",
      },
    ],
  },
}

// Función para resolver submenús por ID
const resolveSubMenus = (submenuIds?: string[]): MenuItem[] => {
  if (!submenuIds) return []
  
  return submenuIds.map(id => {
    const subMenu = subMenus[id]
    if (!subMenu) {
      console.warn(`SubMenu with id "${id}" not found`)
      return {
        id: `missing-${id}`,
        title: `Missing: ${id}`,
        url: "#",
      }
    }
    
    return {
      id: subMenu.id,
      title: subMenu.title,
      url: subMenu.url,
      isHighlighted: subMenu.isHighlighted,
      hasExternalLink: subMenu.hasExternalLink,
      isCollapsible: subMenu.items.length > 0,
      items: subMenu.items.map(item => ({
        id: item.id,
        title: item.title,
        url: item.url,
        isHighlighted: item.isHighlighted,
        hasExternalLink: item.hasExternalLink,
      })),
    }
  })
}

// Función para resolver elementos con submenús anidados
const resolveNestedSubMenus = (items: MenuItem[]): MenuItem[] => {
  return items.map(item => ({
    ...item,
    items: item.submenuIds 
      ? resolveSubMenus(item.submenuIds)
      : item.items?.map(subItem => ({
          ...subItem,
          items: subItem.submenuIds ? resolveSubMenus(subItem.submenuIds) : subItem.items
        }))
  }))
}

// Configuración del menú principal con referencias a submenús
const menuConfig: MenuData = {
  title: "Servicios",
  items: [
    {
      id: "comunidad",
      title: "Servicios a la comunidad",
      url: "#comunidad",
      isHighlighted: true,
    },
    {
      id: "productos",
      title: "Productos locales",
      url: "#productos",
    },
    {
      id: "oficios",
      title: "Oficios religiosos",
      url: "#oficios",
    },
    {
      id: "postales",
      title: "Servicios postales",
      url: "#postales",
    },
    {
      id: "emergencia-main",
      title: "Servicios de emergencia",
      url: "#emergencia-main",
      isCollapsible: true,
      submenuIds: ["emergencia"],
    },
    {
      id: "agua-main",
      title: "Lugares de agua",
      url: "#agua-main",
      isCollapsible: true,
      hasExternalLink: true,
      submenuIds: ["lugaresAgua"],
    },
    {
      id: "colapsable-main",
      title: "Colapsable",
      url: "#colapsable",
      isCollapsible: true,
      items: [
        {
          id: "pantano-nested",
          title: "Avance",
          url: "/advance",
          isCollapsible: true,
          submenuIds: ["pantanoLinks"],
        },
        {
          id: "valle-nested",
          title: "Valle de la alegría",
          url: "/advance",
          isCollapsible: true,
          submenuIds: ["valleAlegria"],
        },
      ],
    },
  ],
}

// Datos del menú procesados
const serviciosData: MenuData = {
  ...menuConfig,
  items: resolveNestedSubMenus(menuConfig.items.map(item => ({
    ...item,
    items: item.submenuIds ? resolveSubMenus(item.submenuIds) : item.items
  })))
}

// Components
const MenuButton: React.FC<{
  onClick: () => void
  isHighlighted?: boolean
  hasExternalLink?: boolean
  title: string
  paddingLeft: number
  children?: React.ReactNode
}> = ({ onClick, isHighlighted, hasExternalLink, title, paddingLeft, children }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-between w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
      isHighlighted ? "text-green-500 font-medium" : "text-gray-700 dark:text-gray-300"
    }`}
    style={{ paddingLeft: `${paddingLeft}px` }}
  >
    <span className="flex items-center gap-2">
      {title}
      {hasExternalLink && <ExternalLink className="h-3 w-3" />}
    </span>
    {children}
  </button>
)

const MenuLink: React.FC<{
  href: string
  isHighlighted?: boolean
  hasExternalLink?: boolean
  title: string
  paddingLeft: number
}> = ({ href, isHighlighted, hasExternalLink, title, paddingLeft }) => (
  <a
    href={href}
    className={`flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
      isHighlighted ? "text-green-500 font-medium" : "text-gray-700 dark:text-gray-300"
    }`}
    style={{ paddingLeft: `${paddingLeft}px` }}
  >
    {title}
    {hasExternalLink && <ExternalLink className="h-3 w-3" />}
  </a>
)

const ExpandIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
  isOpen ? (
    <ChevronDown className="h-4 w-4" />
  ) : (
    <ChevronRight className="h-4 w-4" />
  )
)

const SubMenu: React.FC<{
  items: MenuItem[]
  level: number
}> = ({ items, level }) => (
  <ul className="border-l-2 border-gray-200 dark:border-gray-700 ml-4 bg-gray-50 dark:bg-gray-900/50">
    {items.map((subItem, index) => (
      <CollapsibleMenuItem key={index} item={subItem} level={level + 1} />
    ))}
  </ul>
)

const CollapsibleMenuItem: React.FC<CollapsibleMenuItemProps> = ({ item, level = 0 }) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  
  const paddingLeft: number = level * 16 + 16
  
  if (!item.isCollapsible) {
    return (
      <li>
        <MenuLink
          href={item.url}
          isHighlighted={item.isHighlighted}
          hasExternalLink={item.hasExternalLink}
          title={item.title}
          paddingLeft={paddingLeft}
        />
      </li>
    )
  }

  return (
    <li>
      <MenuButton
        onClick={() => setIsOpen(!isOpen)}
        isHighlighted={item.isHighlighted}
        hasExternalLink={item.hasExternalLink}
        title={item.title}
        paddingLeft={paddingLeft}
      >
        <ExpandIcon isOpen={isOpen} />
      </MenuButton>
      
      {isOpen && item.items && (
        <SubMenu items={item.items} level={level} />
      )}
    </li>
  )
}

const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ isOpen, onClick }) => (
  <button
    onClick={onClick}
    className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-md"
    aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
  >
    {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
  </button>
)

const SidebarHeader: React.FC<{ title: string }> = ({ title }) => (
  <div className="border-b border-gray-200 dark:border-gray-700 p-4">
    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
      {title}
    </h1>
  </div>
)

const SidebarNavigation: React.FC<{ items: MenuItem[] }> = ({ items }) => (
  <nav className="flex-1 overflow-y-auto">
    <ul className="py-2">
      {items.map((item, index) => (
        <CollapsibleMenuItem key={index} item={item} />
      ))}
    </ul>
  </nav>
)

const SidebarOverlay: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => (
  isOpen ? (
    <div 
      className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
      onClick={onClose}
    />
  ) : null
)

const ServiciosSidebar: React.FC<ServiciosSidebarProps> = ({ isOpen, onClose }) => (
  <>
    <SidebarOverlay isOpen={isOpen} onClose={onClose} />
    
    <aside 
      className={`
        fixed md:static inset-y-0 left-0 z-40 w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
    >
      <div className="flex flex-col h-full">
        <SidebarHeader title={serviciosData.title} />
        <SidebarNavigation items={serviciosData.items} />
      </div>
    </aside>
  </>
)

const MainContent: React.FC<MainContentProps> = ({ 
  title = "Contenido Principal",
  description = "Selecciona un elemento del menú para ver su contenido aquí."
}) => (
  <main className="flex-1 md:ml-0">
    <div className="p-4 pt-16 md:pt-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
      </header>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Área de Contenido
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
    </div>
  </main>
)

const ServiciosMenu: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState<boolean>(false)

  const handleMenuToggle = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleMenuClose = (): void => {
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MobileMenuButton 
        isOpen={isMobileMenuOpen} 
        onClick={handleMenuToggle}
      />
      
      <div className="flex">
        <ServiciosSidebar 
          isOpen={isMobileMenuOpen} 
          onClose={handleMenuClose}
        />
        <MainContent />
      </div>
    </div>
  )
}

export default ServiciosMenu