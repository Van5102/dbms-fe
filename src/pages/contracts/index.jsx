import React, { useEffect } from "react";
import { REACT_APP_SERVER_BASE_URL } from 'utils/constants/config'
import { useSearchParams } from "react-router-dom";
const Contract = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code')

  const handleGetContract = async () => {
    window.open(`${REACT_APP_SERVER_BASE_URL}/get-contract/${code}`, '_blank');
  }

  const navigate = async () => {
    await handleGetContract();
    window.close()
  }

  useEffect(() => {
    navigate()
  }, [])

  return (
    <>
    </>
  )
}

export default Contract;