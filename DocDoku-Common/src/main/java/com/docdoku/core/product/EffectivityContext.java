/*
 * DocDoku, Professional Open Source
 * Copyright 2006, 2007, 2008, 2009, 2010, 2011 DocDoku SARL
 *
 * This file is part of DocDoku.
 *
 * DocDoku is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * DocDoku is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with DocDoku.  If not, see <http://www.gnu.org/licenses/>.
 */


package com.docdoku.core.product;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.ManyToOne;
import javax.xml.bind.annotation.XmlSeeAlso;

/**
 *
 * @author Florent Garin
 * @version 1.1, 30/10/11
 * @since   V1.1
 */
@XmlSeeAlso({DateBasedEffectivityContext.class, SerialNumberBasedEffectivityContext.class, LotBasedEffectivityContext.class})
@Inheritance()
@Entity
public abstract class EffectivityContext implements Serializable{

    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Id
    private int id;

    
    @ManyToOne(optional=true, fetch= FetchType.EAGER)
    private ConfigurationItem configurationItem;
    
    public EffectivityContext() {
    }

   

    public void setConfigurationItem(ConfigurationItem configurationItem) {
        this.configurationItem = configurationItem;
    }

    public ConfigurationItem getConfigurationItem() {
        return configurationItem;
    }
    
    
}