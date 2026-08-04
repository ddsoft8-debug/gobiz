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

const SCREEN_WIDTH = 1920;

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
  const stageRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
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
      if (event.key === "Tab") {
        event.preventDefault();
        closeButtonRef.current?.focus();
      }
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
    if (nextPage === page) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    window.history.pushState(null, "", `#${pageHashes[nextPage]}`);
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "instant" });
    window.setTimeout(() => stageRef.current?.focus(), 30);
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
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          aria-label="전체메뉴 열기"
          onClick={() => setMenuOpen(true)}
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
          role="dialog"
          aria-modal="true"
          aria-label="전체메뉴"
        >
          <div className="site-menu-content">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="screen-image" src="/screens/sitemap.svg" alt="고비즈코리아 전체메뉴" />
            <button
              ref={closeButtonRef}
              className="hotspot hotspot-button"
              style={rectStyle({ x: 1555, y: 88, width: 90, height: 90 }, 3042)}
              type="button"
              aria-label="전체메뉴 닫기"
              onClick={() => setMenuOpen(false)}
            />
          </div>
        </div>
      )}
    </main>
  );
}
