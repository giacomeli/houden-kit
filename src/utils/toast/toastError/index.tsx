import { toast } from 'react-toastify'

const toastError = (message: string, autoclose: any) => {
    toast.error(message, {
        position: 'top-right',
        autoClose: autoclose,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    })
}

export default toastError
