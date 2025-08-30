import {Component, Inject, OnInit, PLATFORM_ID, AfterViewInit, OnDestroy} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
// ... existing code ...
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {

  isBrowser: boolean = false;
  private bodyObserver?: MutationObserver;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;
    this.setHeaderOnlyLayout();
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.setHeaderOnlyLayout();
    this.setupBodyObserver();
  }

  ngOnDestroy(): void {
    this.bodyObserver?.disconnect();
  }

  private setHeaderOnlyLayout() {
    const body = document.body;

    // Quitar cualquier rastro de layout de menú y de navbar-sticky
    body.classList.remove(
      'vertical-layout',
      'vertical-menu-modern',
      'vertical-overlay-menu',
      'fixed-navbar',
      'menu-expanded',
      'menu-collapsed',
      'menu-open',
      'menu-hide',
      'navbar-sticky'
    );

    // Usar navbar-floating para el header flotante de Vuexy
    body.classList.add('header-only', 'navbar-floating', 'footer-static');

    if (body.hasAttribute('data-menu')) body.removeAttribute('data-menu');
    if (body.hasAttribute('data-open')) body.removeAttribute('data-open');
    if (body.hasAttribute('data-col')) body.removeAttribute('data-col');

    document.querySelectorAll('.modern-nav-toggle').forEach((el) => {
      (el as HTMLElement).classList.remove('active');
    });

    const menuWrapper = document.querySelector('div[data-menu="menu-wrapper"]') as HTMLElement | null;
    if (menuWrapper) {
      menuWrapper.style.display = 'none';
    }
  }

  private setupBodyObserver() {
    this.bodyObserver = new MutationObserver(() => {
      const body = document.body;
      const menuClasses = ['menu-expanded', 'menu-collapsed', 'menu-open', 'menu-hide', 'vertical-layout', 'vertical-menu-modern', 'vertical-overlay-menu', 'navbar-sticky'];
      let changed = false;
      menuClasses.forEach((c) => {
        if (body.classList.contains(c)) {
          body.classList.remove(c);
          changed = true;
        }
      });
      if (body.hasAttribute('data-menu')) {
        body.removeAttribute('data-menu');
        changed = true;
      }
      if (body.hasAttribute('data-open')) {
        body.removeAttribute('data-open');
        changed = true;
      }
      if (body.hasAttribute('data-col')) {
        body.removeAttribute('data-col');
        changed = true;
      }
      // Asegurar navbar-floating
      if (!body.classList.contains('navbar-floating')) {
        body.classList.add('navbar-floating');
        changed = true;
      }
      if (!body.classList.contains('header-only')) {
        body.classList.add('header-only');
        changed = true;
      }
    });

    this.bodyObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class', 'data-menu', 'data-open', 'data-col']
    });
  }

}
