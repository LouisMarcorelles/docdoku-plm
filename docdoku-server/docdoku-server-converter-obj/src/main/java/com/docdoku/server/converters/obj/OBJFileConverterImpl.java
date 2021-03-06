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

package com.docdoku.server.converters.obj;

import com.docdoku.core.common.BinaryResource;
import com.docdoku.core.product.PartIteration;
import com.docdoku.core.product.PartIterationKey;
import com.docdoku.core.services.*;
import com.docdoku.core.util.FileIO;
import com.docdoku.server.converters.CADConverter;
import com.google.common.io.Files;
import com.google.common.io.InputSupplier;

import javax.ejb.EJB;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Properties;


@OBJFileConverter
public class OBJFileConverterImpl implements CADConverter{

    private final static String PYTHON_SCRIPT="/com/docdoku/server/converters/obj/convert_obj_three.py";
    private final static String CONF_PROPERTIES="/com/docdoku/server/converters/obj/conf.properties";
    private final static Properties CONF = new Properties();

    @EJB
    private IProductManagerLocal productService;

    @EJB
    private IDataManagerLocal dataManager;

    static{
        try {
            CONF.load(OBJFileConverterImpl.class.getResourceAsStream(CONF_PROPERTIES));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public File convert(PartIteration partToConvert, final BinaryResource cadFile) throws IOException, InterruptedException, UserNotActiveException, PartRevisionNotFoundException, WorkspaceNotFoundException, CreationException, UserNotFoundException, NotAllowedException, FileAlreadyExistsException, StorageException {
        String woExName = FileIO.getFileNameWithoutExtension(cadFile.getName());
        File tmpDir = Files.createTempDir();
        File tmpCadFile;
        File tmpJSFile = new File(tmpDir, woExName+".js");
        File tmpBINFile = new File(tmpDir, woExName + ".bin");
        File jsFile = null;
        try {
            String pythonInterpreter = CONF.getProperty("pythonInterpreter");
            File script =  FileIO.urlToFile(OBJFileConverterImpl.class.getResource(PYTHON_SCRIPT));

            tmpCadFile = new File(tmpDir, cadFile.getName());
            Files.copy(new InputSupplier<InputStream>() {
                @Override
                public InputStream getInput() throws IOException {
                    try {
                        return dataManager.getBinaryResourceInputStream(cadFile);
                    } catch (StorageException e) {
                        e.printStackTrace();
                        throw new IOException(e);
                    }
                }
            }, tmpCadFile);

            String[] args = {pythonInterpreter, script.getAbsolutePath(), "-t" ,"binary", "-i", tmpCadFile.getAbsolutePath(), "-o", tmpJSFile.getAbsolutePath()};
            ProcessBuilder pb = new ProcessBuilder(args);
            Process proc = pb.start();
            //Process proc = Runtime.getRuntime().exec(args);
            proc.waitFor();
            int exitCode = proc.exitValue();
            if (exitCode==0) {
                PartIterationKey partIPK = partToConvert.getKey();
                BinaryResource binBinaryResource = productService.saveFileInPartIteration(partIPK, woExName + ".bin", tmpBINFile.length());
                OutputStream binOutputStream = null;
                try {
                    binOutputStream = dataManager.getBinaryResourceOutputStream(binBinaryResource);
                    Files.copy(tmpBINFile, binOutputStream);
                } finally {
                    binOutputStream.flush();
                    binOutputStream.close();
                }

                BinaryResource jsBinaryResource = productService.saveGeometryInPartIteration(partIPK, woExName+".js", 0, tmpJSFile.length());
                OutputStream jsOutputStream = null;
                try {
                    jsOutputStream = dataManager.getBinaryResourceOutputStream(jsBinaryResource);
                    Files.copy(tmpJSFile, jsOutputStream);
                } finally {
                    jsOutputStream.flush();
                    jsOutputStream.close();
                }

            }
            return jsFile;
        } finally {
            FileIO.rmDir(tmpDir);
        }
    }

    @Override
    public boolean canConvertToJSON(String cadFileExtension) {
        return "obj".equalsIgnoreCase(cadFileExtension);
    }
}
