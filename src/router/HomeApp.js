import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Cotizacion } from '../views/Cotizacion'
import { CotizaciónBloqued } from '../views/CotizaciónBloqued'
import { ViewCotización } from '../views/ViewCotización'
import { Home } from '../views/Home'
import { NewQuotation } from '../views/NewQuotation'
import { InProgressQuotation } from '../views/InProgressQuotation'
import { RegisteredQuotation } from '../views/RegisteredQuotation'

export const HomeApp = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/cotizacion' element={< Cotizacion />} />
                    <Route path='/cotizacionV2' element={< Home />} />
                    <Route path='/view/cotizacion/:id_quotation' element={<ViewCotización />} />
                    <Route path='/view/blocked/:id_quotation' element={<CotizaciónBloqued />} />
                    <Route path='/new/quotation/:id_quotation' element={<NewQuotation/>} />
                    <Route path='/inprogress/quotation/:id_quotation' element={<InProgressQuotation/>} />
                    <Route path='/registered/quotation/:id_quotation' element={<RegisteredQuotation/>} />
                    <Route path='/' element={<Navigate to='/cotizacionV2' />} />
                </Routes>
            </BrowserRouter>

        </>
    )
}
