import { Fragment, useContext, useEffect, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  CalendarDaysIcon,
  QueueListIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Affix, Badge, Space } from "antd";
import { BellOutlined, MenuOutlined } from "@ant-design/icons";
import { 
  UserIcon, // Quản lý khách hàng (Ví dụ) 
  BriefcaseIcon, // Quản lý nhân viên (Ví dụ) 
} from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from "react-router-dom"; 
// import { getData } from "../../api/api"; 
import styles from "./ComHeaderStaff.module.css";

const sortOptions = [
  { name: "Thông tin", href: "profile" },
  { name: "Thay đổi mật khẩu", href: "password" },
  { name: "Đăng xuất", href: "login" },
];
const subCategories = [ 
  { name: "Quản lý hồ sơ", href: "/staff/cases", icon: UserIcon }, 
  // { name: "Nhân viên", href: "/admin/employee", icon: BriefcaseIcon },

];

export default function ComHeaderStaff({ children }) {
  const [mobileFiltersOpen, setMobileHeadersOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const [userData, setUserData] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const navigate = useNavigate();
//   const [role, setRole, loadStoredValue] = useStorage("role", null);

  useEffect(() => {
    setActiveCategory(currentPath);
    window.scrollTo(0, 0);
    // loadStoredValue();
  }, [currentPath]);
  function findNameByPathname() {
    const matchingCategory = subCategories.find(
      (category) => category.href === currentPath
    );
    return matchingCategory ? matchingCategory.name : null;
  }
  const handSend = (option) => {
    switch (option) {
      case "login":
        localStorage.removeItem("accessToken");
        localStorage.removeItem("role");
        //localStorage.clear(); // xóa tất cả
        setTimeout(() => {
          navigate("/login");
        }, 0);
        break;
      case "profile":
        navigate("/admin/profile");
        break;
      case "password":
        navigate("/admin/changePassword");
        break;
      default:
        navigate(option);
        break;
    }
  };
  const getAPI = () => {
    // getData("/users/profile")
    //   .then((response) => {
    //     setUserData(response?.data);
    //   })
    //   .catch((er) => {
    //     console.error("Error fetching items:", er);
    //   });
  };
  useEffect(() => {
    getAPI();
  }, []);
//   if (role !== "Admin") {
//     return <ErrorPage goTo={"/"} statusCode={"404"} />;
//   }
  return (
    <div style={{ 
      position: 'relative',
      width: '100vw',
      height: '100%',
      backgroundColor: '#f9fafb',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      <div className={styles.staffHeaderContainer}>
        <Affix offsetTop={0} className="hidden lg:block fixed-sidebar">
          <div className={styles.staffSidebar}>
            <div className={styles.staffLogo}>Xét Nhiệm DNA</div>
            <div className={styles.staffNavLinks}>
              {subCategories.map((category) => (
                <Link
                  to={category.href}
                  key={category.name}
                  className={`${styles.staffNavLink} ${category?.href === activeCategory ? styles.active : ''}`}
                >
                  <category.icon
                    className={`${styles.staffNavIcon} ${category?.href === activeCategory ? styles.active : ''}`}
                    aria-hidden="true"
                  />
                  <h1 className={`${styles.staffNavText} ${category?.href === activeCategory ? styles.active : ''}`}>
                    {category.name}
                  </h1>
                </Link>
              ))}
            </div>
          </div>
        </Affix>
        <div className={styles.staffMainContent}>
          <Transition.Root show={mobileFiltersOpen} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-40 lg:hidden"
              onClose={setMobileHeadersOpen}
            >
              <Transition.Child
                as={Fragment}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className={styles.staffMobileMenuOverlay} />
              </Transition.Child>

              <div className={styles.staffMobileMenuPanel}>
                <Transition.Child
                  as={Fragment}
                  enter="transition ease-in-out duration-300 transform"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transition ease-in-out duration-300 transform"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className={styles.staffMobileMenuContent}>
                    <div className={styles.staffMobileMenuHeader}>
                      <h2 className={styles.staffMobileMenuTitle}>Xét Nhiệm DNA</h2>
                      <button
                        type="button"
                        className={styles.staffMobileMenuClose}
                        onClick={() => setMobileHeadersOpen(false)}
                      >
                        <span className="sr-only">Close menu</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>

                    <form className="mt-4 border-t border-gray-200">
                      <h3 className="sr-only">Xét Nhiệm DNA</h3>
                      <ul role="list" className={styles.staffMobileMenuList}>
                        {subCategories.map((category) => (
                          <li key={category.name}>
                            <Link to={category.href} className="block px-2 py-3">
                              {category.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>
          <Affix offsetTop={0} className="w-full sticky top-0 z-30">
            <div className={styles.staffTopHeader}>
              <h1 className={styles.staffPageTitle}>{findNameByPathname()}</h1>

              <div className={styles.staffHeaderActions}>
                <Space size="large">
                  {/* <Badge count={0} overflowCount={9}>
                    <BellOutlined
                      style={{ fontSize: "30px" }}
                      onClick={() => navigate("/admin/notification")}
                    />
                  </Badge> */}
                  <div className={styles.staffUserName}>{userData?.fullName}</div>
                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <Menu.Button className={styles.staffAvatarButton}>
                        {userData && userData.avatarUrl ? (
                          <img
                            className={styles.staffAvatarImage}
                            src={userData.avatarUrl}
                            alt=""
                          />
                        ) : (
                          <div className="bg-white">
                          <UserCircleIcon className="h-10 w-10" style={{color: "#000",height: "30px",width: "30px"}} />
                          </div>
                        )}
                      </Menu.Button>
                    </div>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className={styles.staffDropdownMenu}>
                        <div>
                          {sortOptions.map((option) => (
                            <Menu.Item key={option.name}>
                              <div
                                onClick={() => handSend(option.href)}
                                className={styles.staffMenuItem}
                              >
                                {option.name}
                              </div>
                            </Menu.Item>
                          ))}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>

                  <button
                    type="button"
                    className={styles.staffMenuButton}
                    onClick={() => setMobileHeadersOpen(true)}
                  >
                    <span className="sr-only">Menu</span>
                    <MenuOutlined className="h-7 w-7 text-black" aria-hidden="true" />
                  </button>
                </Space>
              </div>
            </div>
          </Affix>

          <section className={styles.staffContentSection}>
            <div className={styles.staffContentGrid}>
              <div className={styles.staffContentMain}>
                {/* <div className="lg:w-[calc(100vw-350px)] w-[calc(100vw-70px)]"> */}
                <div className="">
                  {children}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
