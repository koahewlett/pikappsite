import { footerLinkGroups } from '@/lib/data';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <p className="site-footer-mark">Pi Kapp ASU</p>
          <p className="site-footer-copy">
            Rush Pi Kappa Phi at Arizona State University. Theta Xi Chapter, built by the chapter for guys ready to show up.
          </p>
        </div>

        <div className="site-footer-links">
          {footerLinkGroups.map((group) => (
            <div key={group.title}>
              <h3 className="site-footer-group-title">{group.title}</h3>
              <div className="site-footer-list">
                {group.links.map((link) => (
                  <a
                    className="site-footer-link"
                    href={link.href}
                    key={link.label}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="site-footer-bottom">
        <span>© 2026 Pi Kappa Phi - Theta Xi Chapter</span>
        <span>Arizona State University</span>
        <span>This site is maintained by the chapter.</span>
      </div>
    </footer>
  );
}
