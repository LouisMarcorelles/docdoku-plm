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
package com.docdoku.server.dao;

import com.docdoku.core.document.DocumentMaster;
import com.docdoku.core.product.PartRevision;
import com.docdoku.core.workflow.Activity;
import com.docdoku.core.workflow.Task;
import com.docdoku.core.workflow.Workflow;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.Query;

public class WorkflowDAO {

    private EntityManager em;

    public WorkflowDAO(EntityManager pEM) {
        em = pEM;
    }

    public void createWorkflow(Workflow pWf) {
        //Hack to prevent a bug inside the JPA implementation (Eclipse Link)
        List<Activity> activities = pWf.getActivities();
        pWf.setActivities(null);
        em.persist(pWf);
        em.flush();
        pWf.setActivities(activities);
        /*for(Activity activity:activities){
            List<Task> tasks = activity.getTasks();
            activity.setTasks(null);
            em.persist(activity);
            em.flush();
            activity.setTasks(tasks);     
        }*/     
    }

    public DocumentMaster getTarget(Workflow pWorkflow) {
        Query query = em.createQuery("SELECT m FROM DocumentMaster m WHERE m.workflow = :workflow");
        return (DocumentMaster) query.setParameter("workflow", pWorkflow).getSingleResult();
    }

    public PartRevision getPartTarget(Workflow pWorkflow) {
        Query query = em.createQuery("SELECT p FROM PartRevision p WHERE p.workflow = :workflow");
        return (PartRevision) query.setParameter("workflow", pWorkflow).getSingleResult();
    }
}