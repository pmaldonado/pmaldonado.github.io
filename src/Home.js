import headshot from './images/headshot.jpeg';
import './Home.css';

function Home() {
  return (
    <main>
      <div className="wide Home">
        <img src={headshot} id="headshot" alt="Headshot of Peter." />
        <h1>Peter Maldonado</h1>
        <h2>I'm a technologist interested in how data can support sustainable development and efffective governance.</h2>
        <h2>This year, I'm a research fellow at the <a href="https://reglab.stanford.edu/">RegLab</a>, based in Stanford Law School. Previously, I worked at <a href="https://www.freenome.com/">Freenome</a>, <a href="https://www.viaduct.ai/">Viaduct</a>,  Google, and elsewhere. I graduated from Stanford, where I studied applied math and computer science. </h2>
        <h2>In my spare time, I like going outside, social dancing, riding trains, and (poorly) making things.</h2>
        <h2>If any of that sounds interesting, reach out via <a href="mailto:phm@stanford.edu">email</a>, <a href="https://twitter.com/pmaldonado__">Twitter</a>, or <a href="https://www.linkedin.com/in/peterhmaldonado/">LinkedIn</a>.</h2>
      </div>
    </main>
  );
}

export default Home;
