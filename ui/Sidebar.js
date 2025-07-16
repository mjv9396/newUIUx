// components/Sidebar.jsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.css";
import Logo from "@/app/home/components/logo/Logo";
import {
  sidebarJson,
  merchantSidebarJson,
  resellerSidebarJson,
} from "@/constants/sidebar";

const Sidebar = ({ isAdmin, isMerchant, isReseller }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
        setIsOpen(false);
      } else {
        setIsMobile(false);
        setIsOpen(true);
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [sidebarData, setSidebarData] = useState([]);

  useEffect(() => {
    if (isAdmin) {
      setSidebarData(sidebarJson);
    }
    if (isMerchant) {
      setSidebarData(merchantSidebarJson);
    }
    if (isReseller) {
      setSidebarData(resellerSidebarJson);
    }
  }, [isAdmin, isMerchant, isReseller]);

  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleSectionToggle = (moduleName) => {
    setSidebarData((prevData) =>
      prevData.map((section) => ({
        ...section,
        isOpen: moduleName === section.moduleName ? !section.isOpen : false,
      }))
    );
  };

  const handleItemToggle = (moduleName, pageName) => {
    setSidebarData((prevData) =>
      prevData.map((section) => ({
        ...section,
        pageDetails: section.pageDetails.map((item) => ({
          ...item,
          isOpen:
            section.moduleName === moduleName && item.pageName === pageName
              ? !item.isOpen
              : item.isOpen,
        })),
      }))
    );
  };

  // Function to update active states
  const updateActiveStates = (currentPath) => {
    setSidebarData((prevData) =>
      prevData.map((section) => {
        const updatedPages = section.pageDetails.map((page) => {
          // Check if this page is active
          const isPageActive = currentPath === page.pageLink;

          // Check subpages if they exist
          let hasActiveSubpage = false;
          const updatedSubmenu = page.submenu?.map((subpage) => {
            const isSubpageActive = currentPath === subpage.pageLink;
            if (isSubpageActive) hasActiveSubpage = true;
            return { ...subpage, isActive: isSubpageActive };
          });

          return {
            ...page,
            isActive: isPageActive && !hasActiveSubpage,
            submenu: updatedSubmenu,
            isOpen: hasActiveSubpage || page.isOpen,
          };
        });

        // Section is open if it contains an active page/subpage
        const shouldSectionBeOpen = updatedPages.some(
          (page) => page.isActive || page.submenu?.some((sub) => sub.isActive)
        );

        return {
          ...section,
          isOpen: shouldSectionBeOpen || section.isOpen,
          pageDetails: updatedPages,
        };
      })
    );
  };

  // Update active states when pathname changes
  useEffect(() => {
    updateActiveStates(pathname);
  }, [pathname]);

  // Collapse/expand all sections when sidebar is toggled
  useEffect(() => {
    if (!isOpen) {
      // When closing sidebar, expand all sections
      setSidebarData((prevData) =>
        prevData.map((section) => ({
          ...section,
          isOpen: true,
        }))
      );
    } else {
      // When opening sidebar, collapse all except active section
      const updatedData = sidebarData.map((section) => {
        const hasActiveItem = section.pageDetails.some(
          (page) => page.isActive || page.submenu?.some((sub) => sub.isActive)
        );
        return {
          ...section,
          isOpen: hasActiveItem,
        };
      });
      setSidebarData(updatedData);
    }
  }, [isOpen]);

  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed} ${
        isMobile ? styles.mobile : ""
      }`}
    >
      {/* Sidebar Header */}
      <div className={styles.sidebarHeader}>
        <div className={styles.logoContainer}>
          {isOpen && (
            <span className={styles.logoText}>
              <Logo className="logo" />
            </span>
          )}
        </div>
        <button onClick={toggleSidebar} className={styles.toggleButton}>
          {isOpen ? (
            <i className="bi bi-chevron-double-left"></i>
          ) : (
            <i className="bi bi-chevron-double-right"></i>
          )}
        </button>
      </div>

      {/* Sidebar Content */}
      <div className={styles.sidebarContent}>
        {sidebarData?.map((section, sectionIndex) => {
          // Check if this is a section with a single item
          const isSingleItem =
            section.pageDetails.length === 1 &&
            !section.pageDetails[0].submenu?.length;

          if (isSingleItem) {
            // For sections with exactly one item, display just the item without the section header
            const singleItem = section.pageDetails[0];
            return (
              <div key={sectionIndex} className={styles.section}>
                <div
                  className={styles.navItemContainer}
                  style={{
                    paddingLeft: isOpen ? "5px" : "0px",
                    marginTop: "0.5rem",
                    borderLeft: "none",
                  }}
                >
                  <Link
                    href={singleItem.pageLink}
                    className={`${styles.navItem} ${
                      singleItem.isActive ? styles.active : ""
                    }`}
                    style={{
                      paddingLeft: isOpen ? "20px" : "5px",
                    }}
                  >
                    <i
                      className={
                        singleItem.icon ? singleItem.icon : "bi bi-house"
                      }
                    ></i>
                    {isOpen && (
                      <span className={styles.navItemText}>
                        {singleItem.pageName}
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            );
          }

          // For multi-item sections, use the original rendering
          return (
            <div key={sectionIndex} className={styles.section}>
              {isOpen && (
                <div
                  className={styles.sectionHeader}
                  onClick={() => handleSectionToggle(section.moduleName)}
                >
                  <span>{section.moduleName}</span>
                  <i
                    className={`bi bi-chevron-${section.isOpen ? "up" : "down"}`}
                  ></i>
                </div>
              )}

              {(!isOpen || section.isOpen) && (
                <nav className={styles.nav}>
                  {section.pageDetails.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      style={{
                        paddingLeft: isOpen ? "20px" : "5px",
                      }}
                      className={styles.navItemContainer}
                    >
                      <Link
                        href={item.submenu?.length ? "#" : item.pageLink}
                        className={`${styles.navItem} ${
                          item.isActive ? styles.active : ""
                        }`}
                        onClick={(e) => {
                          if (item.submenu?.length) {
                            e.preventDefault();
                            handleItemToggle(section.moduleName, item.pageName);
                          }
                        }}
                      >
                        <i className={item.icon ? item.icon : "bi bi-house"}></i>
                        {isOpen && (
                          <span className={styles.navItemText}>
                            {item.pageName}
                          </span>
                        )}
                        {isOpen && item.submenu?.length > 0 && (
                          <i
                            className={`bi bi-chevron-${
                              item.isOpen ? "up" : "down"
                            } ${styles.submenuToggle}`}
                          ></i>
                        )}
                      </Link>

                      {item.isOpen && item.submenu?.length && (
                        <div className={styles.submenu}>
                          {item.submenu.map((subitem, subIndex) => (
                            <Link
                              key={subIndex}
                              href={subitem.pageLink}
                              className={`${styles.submenuItem} ${
                                subitem.isActive ? styles.active : ""
                              }`}
                            >
                              {isOpen ? (
                                subitem.pageName
                              ) : (
                                <i
                                  className={
                                    subitem.icon ? subitem.icon : "bi bi-house"
                                  }
                                ></i>
                              )}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
