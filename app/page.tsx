"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type PageKey =
  | "main"
  | "preparation"
  | "execution"
  | "logistics"
  | "global"
  | "mypage"
  | "notice-list"
  | "notice-detail";

type Rect = { x: number; y: number; width: number; height: number };
type SitemapTabKey = "guide" | "preparation" | "execution" | "logistics" | "global" | "mypage";

const SCREEN_WIDTH = 1920;
const SITEMAP_CONTENT_START = 258;

const sitemapTabs: Array<{
  key: SitemapTabKey;
  label: string;
  targetY: number;
  rect: Pick<Rect, "x" | "width">;
}> = [
  { key: "guide", label: "고비즈 안내", targetY: 258, rect: { x: 300, width: 180 } },
  { key: "preparation", label: "수출준비", targetY: 575, rect: { x: 485, width: 155 } },
  { key: "execution", label: "수출실행", targetY: 1125, rect: { x: 640, width: 155 } },
  { key: "logistics", label: "물류지원", targetY: 1420, rect: { x: 795, width: 155 } },
  { key: "global", label: "글로벌확장", targetY: 1805, rect: { x: 950, width: 180 } },
  { key: "mypage", label: "마이페이지", targetY: 2115, rect: { x: 1130, width: 180 } },
];

const screens: Record<PageKey, { src: string; height: number; title: string }> = {
  main: { src: "/screens/main.svg", height: 1214, title: "고비즈코리아" },
  preparation: {
    src: "/screens/preparation.svg",
    height: 2543,
    title: "수출준비 | 고비즈코리아",
  },
  execution: {
    src: "/screens/execution.svg",
    height: 1952,
    title: "수출 시행 | 고비즈코리아",
  },
  logistics: {
    src: "/screens/logistics.svg",
    height: 1377,
    title: "물류 지원 | 고비즈코리아",
  },
  global: {
    src: "/screens/global.svg",
    height: 1497,
    title: "글로벌 확장 | 고비즈코리아",
  },
  mypage: {
    src: "/screens/mypage.svg",
    height: 1447,
    title: "마이페이지 | 고비즈코리아",
  },
  "notice-list": {
    src: "/screens/notice-list.svg",
    height: 1630,
    title: "공지사항 | 고비즈코리아",
  },
  "notice-detail": {
    src: "/screens/notice-detail.svg",
    height: 1729,
    title: "공지사항 상세 | 고비즈코리아",
  },
};

const routes: Record<string, PageKey> = {
  "": "main",
  main: "main",
  preparation: "preparation",
  execution: "execution",
  logistics: "logistics",
  global: "global",
  mypage: "mypage",
  notices: "notice-list",
  notice: "notice-detail",
};

const pageHashes: Record<PageKey, string> = {
  main: "main",
  preparation: "preparation",
  execution: "execution",
  logistics: "logistics",
  global: "global",
  mypage: "mypage",
  "notice-list": "notices",
  "notice-detail": "notice",
};

const headerLinks: Array<{ page: PageKey; label: string; rect: Rect }> = [
  { page: "main", label: "고비즈코리아 메인", rect: { x: 310, y: 0, width: 315, height: 82 } },
  { page: "preparation", label: "수출준비", rect: { x: 390, y: 82, width: 155, height: 66 } },
  { page: "execution", label: "수출 시행", rect: { x: 650, y: 82, width: 165, height: 66 } },
  { page: "logistics", label: "물류 지원", rect: { x: 910, y: 82, width: 165, height: 66 } },
  { page: "global", label: "글로벌 확장", rect: { x: 1160, y: 82, width: 180, height: 66 } },
  { page: "mypage", label: "로그인", rect: { x: 1380, y: 0, width: 125, height: 82 } },
];

function rectStyle(rect: Rect, pageHeight: number) {
  return {
    left: `${(rect.x / SCREEN_WIDTH) * 100}%`,
    top: `${(rect.y / pageHeight) * 100}%`,
    width: `${(rect.width / SCREEN_WIDTH) * 100}%`,
    height: `${(rect.height / pageHeight) * 100}%`,
  };
}

function getInitialPage(): PageKey {
  if (typeof window === "undefined") return "main";
  return routes[window.location.hash.slice(1)] ?? "main";
}

export default function Home() {
  const [page, setPage] = useState<PageKey>(getInitialPage);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenuTab, setActiveMenuTab] = useState<SitemapTabKey>("guide");
  const stageRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const menuScrollRef = useRef<HTMLDivElement>(null);
  const screen = screens[page];

  useEffect(() => {
    document.title = screens[page].title;
  }, [page]);

  useEffect(() => {
    const handleHistory = () => setPage(getInitialPage());
    window.addEventListener("hashchange", handleHistory);
    window.addEventListener("popstate", handleHistory);
    return () => {
      window.removeEventListener("hashchange", handleHistory);
      window.removeEventListener("popstate", handleHistory);
    };
  }, []);

  useEffect(() => {
    Object.values(screens).forEach(({ src }) => {
      const image = new Image();
      image.src = src;
    });
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const scrollY = window.scrollY;
    const previousOverflow = document.body.style.overflow;
    const opener = menuButtonRef.current;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.body.style.overflow = previousOverflow;
      window.scrollTo(0, scrollY);
      opener?.focus();
    };
  }, [menuOpen]);

  const extraLinks = useMemo(() => {
    if (page === "logistics") {
      return [
        {
          page: "notice-detail" as PageKey,
          label: "물류 지원 공지사항 상세 보기",
          rect: { x: 320, y: 872, width: 885, height: 230 },
        },
        {
          page: "notice-list" as PageKey,
          label: "공지사항 더보기",
          rect: { x: 1490, y: 810, width: 120, height: 80 },
        },
      ];
    }

    if (page === "global") {
      return [
        {
          page: "notice-detail" as PageKey,
          label: "글로벌 확장 공지사항 상세 보기",
          rect: { x: 320, y: 995, width: 885, height: 220 },
        },
      ];
    }

    if (page === "notice-list") {
      return [
        {
          page: "notice-detail" as PageKey,
          label: "공지사항 글 상세 보기",
          rect: { x: 320, y: 385, width: 1280, height: 850 },
        },
      ];
    }

    if (page === "notice-detail") {
      return [
        {
          page: "notice-list" as PageKey,
          label: "공지사항 목록으로 돌아가기",
          rect: { x: 895, y: 1205, width: 135, height: 70 },
        },
      ];
    }

    return [];
  }, [page]);

  const navigate = (nextPage: PageKey) => {
    if (menuOpen) setMenuOpen(false);

    if (nextPage === page) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    window.history.pushState(null, "", `#${pageHashes[nextPage]}`);
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "instant" });
    window.setTimeout(() => stageRef.current?.focus(), 30);
  };

  const moveToSitemapSection = (tab: (typeof sitemapTabs)[number]) => {
    const scrollArea = menuScrollRef.current;
    if (!scrollArea) return;

    setActiveMenuTab(tab.key);
    scrollArea.scrollTo({
      top: ((tab.targetY - SITEMAP_CONTENT_START) / SCREEN_WIDTH) * scrollArea.clientWidth,
      behavior: "smooth",
    });
  };

  const updateActiveSitemapTab = () => {
    const scrollArea = menuScrollRef.current;
    if (!scrollArea) return;

    const sourceY =
      SITEMAP_CONTENT_START + (scrollArea.scrollTop / scrollArea.clientWidth) * SCREEN_WIDTH + 80;
    const current = [...sitemapTabs].reverse().find((tab) => sourceY >= tab.targetY);
    if (current) setActiveMenuTab(current.key);
  };

  return (
    <main>
      <section
        key={page}
        ref={stageRef}
        className="screen-stage"
        aria-label={screen.title}
        tabIndex={-1}
      >
        {/* SVG 시안을 화면 자체로 사용하므로 일반 이미지 요소가 가장 적합합니다. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="screen-image" src={screen.src} alt={`${screen.title} 화면`} />

        {headerLinks.map((link) => (
          <a
            key={link.page}
            className="hotspot"
            style={rectStyle(link.rect, screen.height)}
            href={`#${pageHashes[link.page]}`}
            aria-label={link.label}
            onClick={(event) => {
              event.preventDefault();
              navigate(link.page);
            }}
          />
        ))}

        <button
          ref={menuButtonRef}
          className="hotspot hotspot-button"
          style={rectStyle({ x: 1450, y: 82, width: 175, height: 66 }, screen.height)}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          aria-label="전체메뉴 열기"
          onClick={() => {
            setActiveMenuTab("guide");
            setMenuOpen(true);
          }}
        />

        {extraLinks.map((link) => (
          <a
            key={link.label}
            className="hotspot"
            style={rectStyle(link.rect, screen.height)}
            href={`#${pageHashes[link.page]}`}
            aria-label={link.label}
            onClick={(event) => {
              event.preventDefault();
              navigate(link.page);
            }}
          />
        ))}
      </section>

      {menuOpen && (
        <div
          id="site-menu"
          className="site-menu"
          role="navigation"
          aria-label="전체메뉴"
        >
          <div className="site-menu-title">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="site-menu-image site-menu-title-image" src="/screens/sitemap.svg" alt="" />
            <h2 className="sr-only">사이트맵</h2>
            <button
              ref={closeButtonRef}
              className="site-menu-close"
              type="button"
              aria-label="전체메뉴 닫기"
              onClick={() => setMenuOpen(false)}
            />
          </div>

          <div className="site-menu-tabs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="site-menu-image site-menu-tabs-image" src="/screens/sitemap.svg" alt="" />
            {sitemapTabs.map((tab) => (
              <button
                key={tab.key}
                className={`site-menu-tab${activeMenuTab === tab.key ? " active" : ""}`}
                style={{
                  left: `${(tab.rect.x / SCREEN_WIDTH) * 100}%`,
                  width: `${(tab.rect.width / SCREEN_WIDTH) * 100}%`,
                }}
                type="button"
                aria-label={`${tab.label} 메뉴로 이동`}
                aria-current={activeMenuTab === tab.key ? "true" : undefined}
                onClick={() => moveToSitemapSection(tab)}
              />
            ))}
          </div>

          <div ref={menuScrollRef} className="site-menu-scroll" onScroll={updateActiveSitemapTab}>
            <div className="site-menu-scroll-art">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="site-menu-image site-menu-content-image"
                src="/screens/sitemap.svg"
                alt="고비즈코리아 사이트맵 메뉴 내용"
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
