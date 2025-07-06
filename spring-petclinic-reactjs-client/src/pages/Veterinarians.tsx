import { useVeterinarians } from "@hooks/useVeterinarians";
import { Loading } from "@components/Loading";
import { ErrorMessage } from "@components/ErrorMessage";
import { formatPersonFullName } from "../utils";

export default function VeterinariansPage() {
  const { data, isLoading, error, refetch } = useVeterinarians();

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage error={error.message} onRetry={() => refetch()} />;

  const veterinariansList = data?.data || [];

  return (
    <div className="container xd-container">
      <h2 id="veterinarians">Veterinarians</h2>

      <div className="row">
        <table id="vetsTable" className="table table-striped" aria-describedby="veterinarians">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Specialties</th>
            </tr>
          </thead>
          <tbody>
            {veterinariansList.map(({ id, firstName, lastName, specialties }) => (
              <tr key={id}>
                <td>{formatPersonFullName(firstName, lastName)}</td>
                <td>{specialties.map(({ name }) => name).join(" ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="row">
        <div className="col-md-2">
          <a href="/vets.xml">View as XML</a>
        </div>
        <div className="col-md-2">
          <a href="/vets.json">View as JSON</a>
        </div>
      </div>

      <br />
      <br />
      <div className="container">
        <div className="row">
          <div className="col-12 text-center">
            <img src="/resources/images/spring-pivotal-logo.png" alt="Sponsored by Pivotal" />
          </div>
        </div>
      </div>
    </div>
  );
}
