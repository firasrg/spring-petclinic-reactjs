import "flatpickr/dist/themes/light.css";
import { useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import Flatpickr from "react-flatpickr";
import { REQUIRED_INPUT } from "@constants/messages";
import { EPetForm } from "@models/enums/EPetForm";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { PetFormSchema } from "@models/form/PetFormSchema";
import * as Routes from "@constants/routes";
import { GET_OWNER, OWNERS as ROUTE_OWNERS } from "@constants/routes";
import { FormError } from "@components/FormError";
import { Loading } from "@components/Loading";
import { ErrorMessage } from "@components/ErrorMessage";
import { useOwner } from "@hooks/useOwners";
import { usePetTypes, usePet, useCreatePet, useUpdatePet } from "@hooks/usePets";
import { formatPersonFullName } from "../../utils";

const yupSchema = yup
  .object()
  .shape({
    [EPetForm.NAME]: yup.string().required(REQUIRED_INPUT),
    [EPetForm.BIRTH_DATE]: yup.date().required(REQUIRED_INPUT),
    [EPetForm.PET_TYPE]: yup.number().required(REQUIRED_INPUT)
  })
  .required();

export default function PetForm() {
  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
    reset,
    watch
  } = useForm<PetFormSchema>({
    resolver: yupResolver(yupSchema),
    mode: "onSubmit"
  });

  const { id: ownerIdParam, petId: petIdParam } = useParams();
  const ownerId = ownerIdParam ? Number(ownerIdParam) : 0;
  const petId = petIdParam ? Number(petIdParam) : undefined;
  const isEdit = !!petId;

  const navigate = useNavigate();

  const { data: owner, isLoading: ownerLoading, error: ownerError } = useOwner(ownerId);
  const { data: petTypesResponse, isLoading: petTypesLoading, error: petTypesError } = usePetTypes();
  const { data: petData, isLoading: petLoading, error: petError } = usePet(ownerId, petId);

  const createPet = useCreatePet();
  const updatePet = useUpdatePet();

  const petTypes = petTypesResponse?.data || [];

  useEffect(() => {
    if (isEdit && petData) {
      const { name, birthDate, type } = petData;
      reset({
        [EPetForm.NAME]: name,
        [EPetForm.BIRTH_DATE]: new Date(birthDate),
        [EPetForm.PET_TYPE]: type.id
      });
    }
  }, [isEdit, petData, reset]);

  const isLoading = ownerLoading || petTypesLoading || (isEdit && petLoading);
  const error = ownerError || petTypesError || (isEdit && petError);

  if (isLoading || createPet.isPending || updatePet.isPending) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage error={error.message} onRetry={() => navigate(`${GET_OWNER}/${ownerId}`)} />;
  }

  if (!owner || !petTypes.length) {
    return <Navigate to={`${ROUTE_OWNERS}/${ownerId}`} />;
  }

  const onSubmit: SubmitHandler<PetFormSchema> = async (data, e) => {
    e?.preventDefault();

    const petType = petTypes.find((p) => p.id === data[EPetForm.PET_TYPE]);
    if (!petType) throw new Error("unable to find pet with ID " + data[EPetForm.PET_TYPE]);

    const petData = { ...data, type: petType };

    try {
      if (!isEdit) {
        await createPet.mutateAsync({ ownerId, data: petData });
      } else {
        await updatePet.mutateAsync({ ownerId, petId: petId!, data: petData });
      }
      navigate(`${Routes.OWNERS}/${ownerId}`);
    } catch (error) {
      // Error handling is done by React Query
    }
  };

  return (
    <div className="container xd-container">
      <h2>{isEdit ? "Edit" : "New"} Pet</h2>

      {(createPet.error || updatePet.error) && (
        <ErrorMessage error={createPet.error?.message || updatePet.error?.message || "An error occurred"} />
      )}

      <form id="pet" className="form-horizontal" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group has-feedback">
          <div className="form-group">
            <label className="col-sm-2 control-label">Owner</label>
            <div className="col-sm-10">{formatPersonFullName(owner.firstName, owner.lastName)}</div>
          </div>

          <div className="form-group ">
            <label className="col-sm-2 control-label">Name</label>
            <div className="col-sm-10">
              <input id="name" className="form-control" type="text" {...register(EPetForm.NAME)} />
              {errors?.[EPetForm.NAME] && <FormError message={errors?.[EPetForm.NAME]?.message} />}
            </div>
          </div>

          <div className="form-group ">
            <label className="col-sm-2 control-label">Birth Date</label>
            <div className="col-sm-10">
              <Flatpickr
                id="birthDate"
                className="form-control flatpickr-input"
                type="date"
                readOnly
                {...register(EPetForm.BIRTH_DATE)}
                value={watch(EPetForm.BIRTH_DATE)}
                onChange={([date]) => {
                  setValue(EPetForm.BIRTH_DATE, date);
                }}
              />
              {errors?.[EPetForm.BIRTH_DATE] && <FormError message={errors?.[EPetForm.BIRTH_DATE]?.message} />}
            </div>
          </div>

          <div className="control-group">
            <div className="form-group ">
              <label className="col-sm-2 control-label">Type </label>
              <div className="col-sm-10">
                <select id="type" className="form-control" size={petTypes.length} {...register(EPetForm.PET_TYPE)}>
                  {petTypes.map(({ id, name }) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </select>
                {errors?.[EPetForm.PET_TYPE] && <FormError message={errors?.[EPetForm.PET_TYPE]?.message} />}
              </div>
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="col-sm-offset-2 col-sm-10">
            <button className="btn btn-primary" type="submit" disabled={createPet.isPending || updatePet.isPending}>
              {isEdit ? "Update" : "Add"} Pet
            </button>
          </div>
        </div>
      </form>

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
