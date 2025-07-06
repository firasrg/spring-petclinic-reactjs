import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  OWNERS,
  OWNERS_ADD_NEW,
  OWNERS_FIND,
  GET_OWNER,
  PET_NEW_FORM,
  VETERINARIANS,
  EDIT_OWNER,
  PET_EDIT_FORM,
  PET_VISITS,
  DASHBOARD
} from "@constants/routes";
import Dashboard from "@pages/Dashboard";
import OwnersPage from "@pages/owners";
import OwnersList from "@pages/owners/OwnersList";
import OwnerDetails from "@pages/owners/OwnerDetails";
import OwnerForm from "@pages/forms/OwnerForm";
import PetForm from "@pages/forms/PetForm";
import VisitsPage from "@pages/owners/Visits";
import VeterinariansPage from "@pages/Veterinarians";
import ErrorPage from "@pages/Error";
import { Layout } from "./Layout";
import { QueryProvider } from "./providers/QueryProvider";

export const App = () => (
  <QueryProvider>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path={DASHBOARD} element={<Dashboard />} />
          <Route path={OWNERS} element={<OwnersPage />} />
          <Route path={OWNERS_FIND} element={<OwnersList />} />
          <Route path={GET_OWNER} element={<OwnerDetails />} />
          <Route path={OWNERS_ADD_NEW} element={<OwnerForm />} />
          <Route path={EDIT_OWNER} element={<OwnerForm />} />
          <Route path={PET_NEW_FORM} element={<PetForm />} />
          <Route path={PET_EDIT_FORM} element={<PetForm />} />
          <Route path={PET_VISITS} element={<VisitsPage />} />
          <Route path={VETERINARIANS} element={<VeterinariansPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </QueryProvider>
);
