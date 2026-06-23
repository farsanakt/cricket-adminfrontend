import logo from "../assets/company-logo.png";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <div className="f-brand">
            <img src={logo} alt="Palaestra" style={{ height: "40px", width: "auto", display: "block" }} />
          </div>
          <p className="f-about">Palaestra Performance &amp; Rehab — structured training, performance monitoring and athlete care.</p>
        </div>
        <div className="f-col"><h4>Manage</h4><a>Dashboard</a><a>Players</a><a>Daily Report</a><a>Exercises</a></div>
        <div className="f-col"><h4>Support Staff</h4><a>Coaches</a><a>Physios</a><a>Trainers</a><a>Nutritionists</a></div>
        <div className="f-col"><h4>Academy</h4><a>About Palaestra</a><a>Tournaments</a><a>Infrastructure</a><a>Contact</a></div>
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <span>© 2026 Palaestra Performance &amp; Rehab</span>
          <span className="fb-accent">Powered by Palaestra</span>
        </div>
      </div>
    </footer>
  );
}
