package com.docdoku.cli.helpers;

import com.docdoku.cli.exceptions.StatusException;
import com.docdoku.core.common.User;
import com.docdoku.core.product.PartIteration;
import com.docdoku.core.product.PartMaster;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

import java.util.Date;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: cangac
 * Date: 11/06/13
 * Time: 12:44
 * To change this template use File | Settings | File Templates.
 */
public class JSONPrinter {

    public static void printPartMasterStatus(PartMaster pm) throws JSONException {
        JSONObject status = new JSONObject();

        status.put("isCheckedOut", pm.getLastRevision().isCheckedOut());
        status.put("partNumber", pm.getNumber());
        User user = pm.getLastRevision().getCheckOutUser();
        String login = user != null ? user.getLogin() : "";
        status.put("checkoutUser", login);
        Date checkoutDate = pm.getLastRevision().getCheckOutDate();
        Long timeStamp = checkoutDate != null ? checkoutDate.getTime() : null;
        status.put("checkoutDate", timeStamp);
        status.put("workspace", pm.getWorkspace().getId());
        status.put("version", pm.getLastRevision().getVersion());
        status.put("description", pm.getLastRevision().getDescription());

        List<PartIteration> partIterations = pm.getLastRevision().getPartIterations();
        JSONArray partIterationJSonArray;
        if (partIterations != null) {
            partIterationJSonArray = new JSONArray();
            for(PartIteration partIteration : partIterations) {
                partIterationJSonArray.put(partIteration.getIteration());
            }
            status.put("iterations", partIterationJSonArray);
        }

        System.out.println(status.toString());
    }

    public static void printException(StatusException e) throws JSONException {
        JSONObject jsonObj = new JSONObject();
        jsonObj.put("statusError", e.getMessage());
        System.out.println(jsonObj);
    }
}
