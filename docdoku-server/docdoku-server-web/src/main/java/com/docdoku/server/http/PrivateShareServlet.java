/*
 * DocDoku, Professional Open Source
 * Copyright 2006 - 2013 DocDoku SARL
 *
 * This file is part of DocDokuPLM.
 *
 * DocDokuPLM is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * DocDokuPLM is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with DocDokuPLM.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.docdoku.server.http;

import com.docdoku.core.document.DocumentIteration;
import com.docdoku.core.document.DocumentMaster;
import com.docdoku.core.meta.InstanceAttribute;
import com.docdoku.core.product.PartIteration;
import com.docdoku.core.product.PartRevision;
import com.docdoku.core.services.IDocumentManagerLocal;
import com.docdoku.core.services.IProductManagerLocal;
import com.docdoku.core.services.IShareManagerLocal;
import com.docdoku.core.services.SharedEntityNotFoundException;
import com.docdoku.core.sharing.SharedDocument;
import com.docdoku.core.sharing.SharedEntity;
import com.docdoku.core.sharing.SharedPart;

import javax.ejb.EJB;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLDecoder;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Date;
import java.util.regex.Pattern;

/**
 * @author Morgan Guimard
 */

public class PrivateShareServlet extends HttpServlet {

    @EJB
    private IDocumentManagerLocal documentService;

    @EJB
    private IProductManagerLocal productService;

    @EJB
    IShareManagerLocal shareService;

    @Override
    protected void doPost(HttpServletRequest pRequest, HttpServletResponse pResponse) throws ServletException, IOException {

        String[] pathInfos = Pattern.compile("/").split(pRequest.getRequestURI());
        int offset = pRequest.getContextPath().isEmpty() ? 2 : 3;
        String uuid = URLDecoder.decode(pathInfos[offset], "UTF-8");

        try{

            SharedEntity sharedEntity = shareService.findSharedEntityForGivenUUID(uuid);

            // check if expire
            if(sharedEntity.getExpireDate() != null){
                if(sharedEntity.getExpireDate().getTime() < new Date().getTime()){
                    shareService.deleteSharedEntityIfExpired(sharedEntity);
                    pRequest.getRequestDispatcher("/faces/sharedEntityExpired.xhtml").forward(pRequest, pResponse);
                    return;
                }
            }

            // check shared entity password and provided password

            if(sharedEntity.getPassword() != null){

                String providedPassword = (String) pRequest.getParameter("password");

                if(providedPassword != null){

                    if(md5sum(providedPassword).equals(sharedEntity.getPassword())){
                        handleOnCheckSuccess(pRequest,pResponse,sharedEntity);
                    }else{
                        pRequest.getRequestDispatcher("/faces/sharedEntityPassword.xhtml").forward(pRequest, pResponse);
                    }

                }else{
                    pRequest.getRequestDispatcher("/faces/sharedEntityPassword.xhtml").forward(pRequest, pResponse);
                }

            }else{
                // shouldn't arrive
                handleOnCheckSuccess(pRequest, pResponse, sharedEntity);
            }

        } catch (Exception pEx) {
            pEx.printStackTrace();
            throw new ServletException("error while fetching your document.", pEx);
        }

    }

    @Override
    protected void doGet(HttpServletRequest pRequest, HttpServletResponse pResponse) throws ServletException, IOException {

        try {

            String[] pathInfos = Pattern.compile("/").split(pRequest.getRequestURI());
            int offset = pRequest.getContextPath().isEmpty() ? 2 : 3;
            String uuid = URLDecoder.decode(pathInfos[offset], "UTF-8");

            try{

                SharedEntity sharedEntity = shareService.findSharedEntityForGivenUUID(uuid);

                // check if expire
                if(sharedEntity.getExpireDate() != null){
                    if(sharedEntity.getExpireDate().getTime() < new Date().getTime()){
                        shareService.deleteSharedEntityIfExpired(sharedEntity);
                        pRequest.getRequestDispatcher("/faces/sharedEntityExpired.xhtml").forward(pRequest, pResponse);
                        return;
                    }
                }

                // check if password protected -> should come from the doPost
                if(sharedEntity.getPassword() != null){
                    pRequest.getRequestDispatcher("/faces/sharedEntityPassword.xhtml").forward(pRequest, pResponse);
                }else{
                    // Tests for doGet are ok
                    handleOnCheckSuccess(pRequest,pResponse,sharedEntity);
                }


            }catch(SharedEntityNotFoundException ex){
                pRequest.removeAttribute("sharedEntity");
            }

        } catch (Exception pEx) {
            pEx.printStackTrace();
            throw new ServletException("error while processing th request.", pEx);
        }
    }

    private void handleOnCheckSuccess(HttpServletRequest pRequest, HttpServletResponse pResponse, SharedEntity sharedEntity) throws ServletException, IOException {

        pRequest.setAttribute("sharedEntity",sharedEntity);

        if(sharedEntity instanceof SharedDocument){

            DocumentMaster docM = ((SharedDocument) sharedEntity).getDocumentMaster();
            DocumentIteration docI =  docM.getLastIteration();

            pRequest.setAttribute("docm", docM);
            pRequest.setAttribute("attr",  new ArrayList<InstanceAttribute>(docI.getInstanceAttributes().values()));

            pRequest.getRequestDispatcher("/faces/documentPermalink.xhtml").forward(pRequest, pResponse);

        }else if(sharedEntity instanceof SharedPart){

            PartRevision partRevision = ((SharedPart) sharedEntity).getPartRevision();
            pRequest.setAttribute("partRevision", partRevision);

            PartIteration partIteration =  partRevision.getLastIteration();
            pRequest.setAttribute("attr",  new ArrayList<InstanceAttribute>(partIteration.getInstanceAttributes().values()));

            pRequest.getRequestDispatcher("/faces/partPermalink.xhtml").forward(pRequest, pResponse);
        }

    }


    private String md5sum(String pText) throws NoSuchAlgorithmException {

        byte[] digest = MessageDigest.getInstance("MD5").digest(pText.getBytes());
        StringBuffer hexString = new StringBuffer();
        for (int i=0; i < digest.length; i++) {
            String hex = Integer.toHexString(0xFF & digest[i]);
            if (hex.length() == 1) {
                hexString.append("0" + hex);
            } else {
                hexString.append(hex);
            }
        }
        return hexString.toString();

    }


}
