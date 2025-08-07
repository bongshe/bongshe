// src/components/Breadcrumb.tsx
import Link from 'next/link'
import { ChevronRightIcon } from '@heroicons/react/20/solid'

interface BreadcrumbItem {
  name: string
  href: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex py-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={item.name}>
            <div className="flex items-center">
              {index > 0 && (
                <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              )}
              {index === items.length - 1 ? (
                <span className="ml-2 text-sm font-medium text-gray-500">{item.name}</span>
              ) : (
                <Link
                  href={item.href}
                  className={`text-sm font-medium text-gray-500 hover:text-gray-700 ${
                    index === 0 ? '' : 'ml-2'
                  }`}
                >
                  {item.name}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}