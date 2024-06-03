// volverAtras.js
import { useRouter } from 'next/navigation';
import React from 'react';
import { Stack } from 'react-bootstrap';

const VolverAtras = () => {
    const router = useRouter()
    return (
        <Stack direction='horizontal' className='pb-2 fs-6 selectable link-secondary text-secondary' gap={2}
            onClick={()=> {
                router.back()
            }
        }>
            <i class="fa-solid fa-arrow-left"></i>
            Volver hacia atrás
        </Stack>
    );
};

export default VolverAtras;
