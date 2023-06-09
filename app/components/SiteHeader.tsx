import { Link } from '@remix-run/react';
import Logo from '~/components/Logo';
import { Dialog, Popover, Transition } from '@headlessui/react';
import classNames from 'classnames';
import { Fragment, useState } from 'react';
import { Bars3Icon, ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRootLoaderData } from '~/root';

const navigation: { pages: { name: string; href: string }[] } = {
  pages: [],
};

export function SiteHeader() {
  const { featuredProducts, cartQty } = useRootLoaderData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleLinkClick() {
    setMobileMenuOpen(false);
  }

  return (
    <>
      {/* Mobile menu */}
      <Transition.Root show={mobileMenuOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileMenuOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                <div className="flex px-4 pb-2 pt-5">
                  <button
                    type="button"
                    className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Links */}
                <div className="space-y-12 px-4 py-6">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-10">
                    {featuredProducts.map((item) => (
                      <div key={item.name} className="group relative">
                        <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-md bg-gray-100 group-hover:opacity-75">
                          {item.imageSrc ? (
                            <img src={item.imageSrc} alt={item.imageAlt} className="object-cover object-center" />
                          ) : null}
                        </div>
                        <Link
                          to={`/products/${item.id}`}
                          className="mt-6 block text-sm font-medium text-gray-900"
                          onClick={handleLinkClick}
                        >
                          <span className="absolute inset-0 z-10" aria-hidden="true" />
                          {item.name}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                  {navigation.pages.map((page) => (
                    <div key={page.name} className="flow-root">
                      <Link
                        to={page.href}
                        className="-m-2 block p-2 font-medium text-gray-900"
                        onClick={handleLinkClick}
                      >
                        {page.name}
                      </Link>
                    </div>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      <header className="relative">
        <nav aria-label="Top" className="bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Logo (lg+) */}
              <div className="hidden lg:flex lg:flex-1 lg:items-center">
                <Link to="/">
                  <span className="sr-only">The Backyard Flora</span>
                  <Logo className="h-8 w-auto" />
                </Link>
              </div>

              <div className="hidden h-full lg:flex">
                {/* Flyout menus */}
                <Popover.Group className="inset-x-0 bottom-0 px-4">
                  <div className="flex h-full justify-center space-x-8">
                    <Link to={'/'} className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800">
                      Home
                    </Link>

                    <Popover className="flex">
                      {({ open, close }) => (
                        <>
                          <div className="relative flex">
                            <Popover.Button
                              className={classNames(
                                open ? 'text-primary' : 'text-gray-700 hover:text-gray-800',
                                'relative flex items-center justify-center text-sm font-medium outline-none transition-colors duration-200 ease-out'
                              )}
                            >
                              Flowers
                              <span
                                className={classNames(
                                  open ? 'bg-primary' : '',
                                  'absolute inset-x-0 -bottom-px z-20 h-0.5 transition duration-200 ease-out'
                                )}
                                aria-hidden="true"
                              />
                            </Popover.Button>
                          </div>

                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Popover.Panel
                              className="absolute inset-x-0 top-full z-10 bg-white text-sm text-gray-500"
                              data-testid="header-flyout-panel"
                            >
                              {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                              <div className="absolute inset-0 top-1/2 bg-white shadow" aria-hidden="true" />
                              {/* Fake border when menu is open */}
                              <div className="absolute inset-0 top-0 mx-auto h-px max-w-7xl px-8" aria-hidden="true">
                                <div
                                  className={classNames(
                                    open ? 'bg-gray-200' : 'bg-transparent',
                                    'h-px w-full transition-colors duration-200 ease-out'
                                  )}
                                />
                              </div>

                              <div className="relative">
                                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                  <div className="grid grid-cols-3 gap-x-8 gap-y-10 py-16">
                                    {featuredProducts.map((item) => (
                                      <div key={item.name} className="group relative">
                                        <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-md bg-gray-100 group-hover:opacity-75">
                                          {item.imageSrc ? (
                                            <img
                                              src={item.imageSrc}
                                              alt={item.imageAlt}
                                              className="object-cover object-center"
                                            />
                                          ) : null}
                                        </div>
                                        <Link
                                          to={`/products/${item.id}`}
                                          className="mt-4 block font-medium text-gray-900"
                                          onClick={close}
                                        >
                                          <span className="absolute inset-0 z-10" aria-hidden="true" />
                                          {item.name}
                                        </Link>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </Popover.Panel>
                          </Transition>
                        </>
                      )}
                    </Popover>

                    {navigation.pages.map((page) => (
                      <Link
                        key={page.name}
                        to={page.href}
                        className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                      >
                        {page.name}
                      </Link>
                    ))}
                  </div>
                </Popover.Group>
              </div>

              {/* Mobile menu and search (lg-) */}
              <div className="flex flex-1 items-center lg:hidden">
                <button
                  type="button"
                  className="-ml-2 rounded-md bg-white p-2 text-gray-400"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <span className="sr-only">Open menu</span>
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* Logo (lg-) */}
              <Link to="/" className="lg:hidden">
                <span className="sr-only">The Backyard Flora</span>
                <Logo className="h-8 w-auto" />
              </Link>

              <div className="flex flex-1 items-center justify-end">
                <div className="flex items-center lg:ml-8">
                  {/* Cart */}
                  <div className="ml-4 flow-root lg:ml-8">
                    <Link to="/cart" className="group -m-2 flex items-center p-2">
                      <ShoppingBagIcon
                        className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                        {cartQty}
                      </span>
                      <span className="sr-only">items in cart, view cart</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
