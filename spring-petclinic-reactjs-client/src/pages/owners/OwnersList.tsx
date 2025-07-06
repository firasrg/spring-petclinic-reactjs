import { useSearchParams, Link } from "react-router-dom";
import { LAST_NAME } from "@constants/searchParams";
import { useOwners } from "@hooks/useOwners";
import { Loading } from "@components/Loading";
import { ErrorMessage } from "@components/ErrorMessage";

export default function OwnersList() {
  const [searchParams] = useSearchParams();
  const lastName = searchParams.get(LAST_NAME) || undefined;

  const { data, isLoading, error, refetch } = useOwners({ lastName });

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage error={error.message} onRetry={() => refetch()} />;

  const owners = data?.data || [];

  return (
    <div className="container xd-container">
      <h2 id="owners">Owners</h2>

      <table id="ownersTable" className="table table-striped" aria-describedby="owners">
        <thead>
          <tr>
            <th scope="col" style={{ width: 150 }}>
              Name
            </th>
            <th scope="col" style={{ width: 200 }}>
              Address
            </th>
            <th scope="col">City</th>
            <th scope="col" style={{ width: 120 }}>
              Telephone
            </th>
            <th scope="col">Pets</th>
          </tr>
        </thead>
        <tbody>
          {owners.map((owner) => (
            <tr key={owner.id}>
              <td>
                <Link to={`/owners/${owner.id}`}>
                  {owner.firstName} {owner.lastName}
                </Link>
              </td>
              <td>{owner.address}</td>
              <td>{owner.city}</td>
              <td>{owner.telephone}</td>
              <td>{owner.pets.map((pet) => pet.name).join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>

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
