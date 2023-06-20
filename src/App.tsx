import { useLocation } from 'react-router-dom';
import ErrorPage from './Error';
import { Menu } from './navigation';
import { VetList, OwnerList } from './components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Root from './Root';

export default function App() {
  // TODO: add ErrorPage to Routes

  //const location = useLocation();

  return (
    <>
    <div>
      <Router>
        <Menu name={'Pets'} />
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/owners/list" element={<OwnerList />} />
          <Route path="/vets" element={<VetList />} />
        </Routes>
      </Router>
      <div className="container-fluid">
        <div className="row"> 
          <div className="col-12 text-center">
            <img src="/images/spring-pivotal-logo.png" alt="Sponsored by Pivotal" />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
