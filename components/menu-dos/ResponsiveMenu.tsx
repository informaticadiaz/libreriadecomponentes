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
  component?: string
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
  component?: string
  items: BaseMenuItem[]
}

interface MenuData {
  title: string
  items: MenuItem[]
}

interface CollapsibleMenuItemProps {
  item: MenuItem
  level?: number
  onItemClick: (item: MenuItem) => void
}

interface MobileMenuButtonProps {
  isOpen: boolean
  onClick: () => void
}

interface ServiciosSidebarProps {
  isOpen: boolean
  onClose: () => void
  onItemClick: (item: MenuItem) => void
}

interface MainContentProps {
  activeItem: MenuItem | null
}

// Componentes de contenido para cada sección
const ContentComponents: Record<string, React.FC<{ item: MenuItem }>> = {
  comunidad: () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-green-600">Servicios a la Comunidad</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Programas Sociales</h3>
          <ul className="space-y-2">
            <li>• Apoyo a familias vulnerables</li>
            <li>• Programas de capacitación laboral</li>
            <li>• Asistencia alimentaria</li>
          </ul>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Servicios Municipales</h3>
          <ul className="space-y-2">
            <li>• Registro civil</li>
            <li>• Licencias y permisos</li>
            <li>• Atención ciudadana</li>
          </ul>
        </div>
      </div>
    </div>
  ),

  productos: () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-amber-600">Productos Locales</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { name: "Miel Artesanal", price: "$15.000", image: "🍯" },
          { name: "Quesos de Cabra", price: "$12.000", image: "🧀" },
          { name: "Vino Casero", price: "$25.000", image: "🍷" },
          { name: "Pan de Campo", price: "$8.000", image: "🍞" },
          { name: "Mermeladas", price: "$10.000", image: "🍓" },
          { name: "Aceite de Oliva", price: "$18.000", image: "🫒" },
        ].map((product, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm">
            <div className="text-4xl mb-2">{product.image}</div>
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-green-600 font-bold">{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  ),

  policia: () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-blue-600">Policía Municipal</h2>
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Contacto de Emergencia</h3>
        <div className="text-2xl font-bold text-red-600 mb-4">📞 911</div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Horarios de Atención:</h4>
            <p>Lunes a Viernes: 8:00 - 20:00</p>
            <p>Sábados: 8:00 - 14:00</p>
            <p>Emergencias: 24/7</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Servicios:</h4>
            <ul className="space-y-1">
              <li>• Patrullaje urbano</li>
              <li>• Control de tránsito</li>
              <li>• Atención de denuncias</li>
              <li>• Operativos de seguridad</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),

  pantano: () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-teal-600">Pantano de Peña</h2>
      <div className="bg-teal-50 dark:bg-teal-900/20 p-6 rounded-lg">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Información General</h3>
            <p className="mb-4">
              El Pantano de Peña es un hermoso embalse ubicado en las montañas, 
              ideal para actividades recreativas y deportes acuáticos.
            </p>
            <h4 className="font-semibold mb-2">Actividades Disponibles:</h4>
            <ul className="space-y-1">
              <li>🎣 Pesca deportiva</li>
              <li>🚣 Kayak y canoa</li>
              <li>🏊 Natación</li>
              <li>📸 Fotografía paisajística</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3">Horarios y Precios</h3>
            <div className="space-y-2">
              <p><strong>Horarios:</strong> 6:00 AM - 6:00 PM</p>
              <p><strong>Entrada:</strong> $5.000 por persona</p>
              <p><strong>Parking:</strong> Gratuito</p>
              <p><strong>Temporada:</strong> Todo el año</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),

  default: ({ item }) => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-700 dark:text-gray-300">{item.title}</h2>
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
        <p className="text-lg mb-4">
          Esta es la página de <strong>{item.title}</strong>
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-xl font-semibold mb-3">Información</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Contenido específico para {item.title}. Este componente se puede 
              personalizar según las necesidades de cada sección.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3">Detalles</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>• ID: {item.id}</li>
              <li>• URL: {item.url}</li>
              <li>• Tipo: {item.isCollapsible ? 'Menú' : 'Página'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// Submenús reutilizables
const subMenus: Record<string, SubMenu> = {
  emergencia: {
    id: "emergencia",
    title: "Servicios de emergencia",
    url: "#emergencia",
    component: "default",
    items: [
      {
        id: "policia",
        title: "Policía municipal",
        url: "#policia",
        component: "policia",
      },
      {
        id: "hospitales",
        title: "Hospitales",
        url: "#hospitales",
        component: "default",
      },
      {
        id: "bomberos-emergencia",
        title: "Bomberos",
        url: "#bomberos",
        component: "default",
      },
    ],
  },
  lugaresAgua: {
    id: "lugaresAgua",
    title: "Lugares de agua",
    url: "#lugares-agua",
    hasExternalLink: true,
    component: "default",
    items: [
      {
        id: "pantano",
        title: "Pantano de pena",
        url: "#pantano",
        component: "pantano",
      },
      {
        id: "pesquera",
        title: "La Pesquera",
        url: "#pesquera",
        component: "default",
      },
      {
        id: "bomberos-agua",
        title: "Bomberos",
        url: "#bomberos-agua",
        component: "default",
      },
    ],
  },
  pantanoLinks: {
    id: "pantanoLinks",
    title: "Pantano de pena",
    url: "#pantano-links",
    component: "pantano",
    items: [
      {
        id: "link1",
        title: "Link #1",
        url: "#link1",
        component: "default",
      },
      {
        id: "link2",
        title: "Link #2",
        url: "#link2",
        component: "default",
      },
    ],
  },
  valleAlegria: {
    id: "valleAlegria",
    title: "Valle de la alegría",
    url: "#valle-alegria",
    component: "default",
    items: [
      {
        id: "sendero",
        title: "Sendero principal",
        url: "#sendero",
        component: "default",
      },
      {
        id: "mirador",
        title: "Mirador norte",
        url: "#mirador",
        component: "default",
      },
      {
        id: "camping",
        title: "Zona de camping",
        url: "#camping",
        component: "default",
      },
      {
        id: "centro",
        title: "Centro de visitantes",
        url: "#centro",
        component: "default",
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
        component: "default",
      }
    }
    
    return {
      id: subMenu.id,
      title: subMenu.title,
      url: subMenu.url,
      isHighlighted: subMenu.isHighlighted,
      hasExternalLink: subMenu.hasExternalLink,
      component: subMenu.component,
      isCollapsible: subMenu.items.length > 0,
      items: subMenu.items.map(item => ({
        id: item.id,
        title: item.title,
        url: item.url,
        isHighlighted: item.isHighlighted,
        hasExternalLink: item.hasExternalLink,
        component: item.component,
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

// Configuración del menú principal
const menuConfig: MenuData = {
  title: "Servicios",
  items: [
    {
      id: "comunidad",
      title: "Servicios a la comunidad",
      url: "#comunidad",
      isHighlighted: true,
      component: "comunidad",
    },
    {
      id: "productos",
      title: "Productos locales",
      url: "#productos",
      component: "productos",
    },
    {
      id: "oficios",
      title: "Oficios religiosos",
      url: "#oficios",
      component: "default",
    },
    {
      id: "postales",
      title: "Servicios postales",
      url: "#postales",
      component: "default",
    },
    {
      id: "emergencia-main",
      title: "Servicios de emergencia",
      url: "#emergencia-main",
      isCollapsible: true,
      component: "default",
      submenuIds: ["emergencia"],
    },
    {
      id: "agua-main",
      title: "Lugares de agua",
      url: "#agua-main",
      isCollapsible: true,
      hasExternalLink: true,
      component: "default",
      submenuIds: ["lugaresAgua"],
    },
    {
      id: "colapsable-main",
      title: "Colapsable",
      url: "#colapsable",
      isCollapsible: true,
      component: "default",
      items: [
        {
          id: "pantano-nested",
          title: "Pantano de pena",
          url: "#pantano-nested",
          isCollapsible: true,
          component: "pantano",
          submenuIds: ["pantanoLinks"],
        },
        {
          id: "valle-nested",
          title: "Valle de la alegría",
          url: "#valle-nested",
          isCollapsible: true,
          component: "default",
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
  onClick: () => void
}> = ({ isHighlighted, hasExternalLink, title, paddingLeft, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full text-left ${
      isHighlighted ? "text-green-500 font-medium" : "text-gray-700 dark:text-gray-300"
    }`}
    style={{ paddingLeft: `${paddingLeft}px` }}
  >
    {title}
    {hasExternalLink && <ExternalLink className="h-3 w-3" />}
  </button>
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
  onItemClick: (item: MenuItem) => void
}> = ({ items, level, onItemClick }) => (
  <ul className="border-l-2 border-gray-200 dark:border-gray-700 ml-4 bg-gray-50 dark:bg-gray-900/50">
    {items.map((subItem, index) => (
      <CollapsibleMenuItem key={index} item={subItem} level={level + 1} onItemClick={onItemClick} />
    ))}
  </ul>
)

const CollapsibleMenuItem: React.FC<CollapsibleMenuItemProps> = ({ item, level = 0, onItemClick }) => {
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
          onClick={() => onItemClick(item)}
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
        <SubMenu items={item.items} level={level} onItemClick={onItemClick} />
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

const SidebarNavigation: React.FC<{ 
  items: MenuItem[]
  onItemClick: (item: MenuItem) => void 
}> = ({ items, onItemClick }) => (
  <nav className="flex-1 overflow-y-auto">
    <ul className="py-2">
      {items.map((item, index) => (
        <CollapsibleMenuItem key={index} item={item} onItemClick={onItemClick} />
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

const ServiciosSidebar: React.FC<ServiciosSidebarProps> = ({ isOpen, onClose, onItemClick }) => (
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
        <SidebarNavigation items={serviciosData.items} onItemClick={onItemClick} />
      </div>
    </aside>
  </>
)

const MainContent: React.FC<MainContentProps> = ({ activeItem }) => {
  const renderContent = () => {
    if (!activeItem) {
      return (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-700 dark:text-gray-300">
            Bienvenido a Servicios
          </h2>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <p className="text-lg mb-4">
              Selecciona un elemento del menú para ver su contenido.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <div className="text-4xl mb-2">🏛️</div>
                <h3 className="font-semibold">Servicios Municipales</h3>
              </div>
              <div className="text-center p-4">
                <div className="text-4xl mb-2">🚨</div>
                <h3 className="font-semibold">Emergencias</h3>
              </div>
              <div className="text-center p-4">
                <div className="text-4xl mb-2">🌊</div>
                <h3 className="font-semibold">Turismo</h3>
              </div>
            </div>
          </div>
        </div>
      )
    }

    const componentKey = activeItem.component || 'default'
    const ContentComponent = ContentComponents[componentKey] || ContentComponents.default
    
    return <ContentComponent item={activeItem} />
  }

  return (
    <main className="flex-1 md:ml-0">
      <div className="p-4 pt-16 md:pt-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
          {renderContent()}
        </div>
      </div>
    </main>
  )
}

const ServiciosMenu: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState<boolean>(false)
  const [activeItem, setActiveItem] = React.useState<MenuItem | null>(null)

  const handleMenuToggle = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleMenuClose = (): void => {
    setIsMobileMenuOpen(false)
  }

  const handleItemClick = (item: MenuItem): void => {
    setActiveItem(item)
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false)
    }
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
          onItemClick={handleItemClick}
        />
        <MainContent activeItem={activeItem} />
      </div>
    </div>
  )
}

export default ServiciosMenu