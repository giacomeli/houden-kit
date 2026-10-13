import { toast } from 'react-toastify'

const toastSuccess = (message: string, autoclose: any) => {
    toast.success(message, {
        position: 'top-right',
        autoClose: autoclose,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    })
}

export default toastSuccess
