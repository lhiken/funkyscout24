import { useRouteError, isRouteErrorResponse } from "react-router-dom"

const ErrorPage: React.FC = () => {
  const error = useRouteError();

  return (
    <>
      <div id='error-page'>
        An error has occured!
        <div>
            {
            isRouteErrorResponse(error) ?
                (error.status + ' ' + error.statusText) : 'Unknown Error'
            }
        </div>
      </div>
    </>
  );
}

export default ErrorPage;