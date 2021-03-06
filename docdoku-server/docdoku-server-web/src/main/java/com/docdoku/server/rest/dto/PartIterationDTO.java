package com.docdoku.server.rest.dto;

import javax.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

@XmlRootElement
public class PartIterationDTO implements Serializable {

    private String workspaceId;
    private int iteration;
    private String nativeCADFile;
    private String iterationNote;
    private UserDTO author;
    private Date creationDate;
    private List<InstanceAttributeDTO> instanceAttributes;
    private List<PartUsageLinkDTO> components;
    private List<DocumentIterationDTO> linkedDocuments;
    private String number;
    private String version;

    public PartIterationDTO() {
    }

    public String getWorkspaceId() {
        return workspaceId;
    }

    public void setWorkspaceId(String workspaceId) {
        this.workspaceId = workspaceId;
    }

    public int getIteration() {
        return iteration;
    }

    public void setIteration(int iteration) {
        this.iteration = iteration;
    }

    public String getNativeCADFile() {
        return nativeCADFile;
    }

    public void setNativeCADFile(String nativeCADFile) {
        this.nativeCADFile = nativeCADFile;
    }

    public String getIterationNote() {
        return iterationNote;
    }

    public void setIterationNote(String iterationNote) {
        this.iterationNote = iterationNote;
    }

    public UserDTO getAuthor() {
        return author;
    }

    public void setAuthor(UserDTO author) {
        this.author = author;
    }

    public Date getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Date creationDate) {
        this.creationDate = creationDate;
    }

    public List<InstanceAttributeDTO> getInstanceAttributes() {
        return instanceAttributes;
    }

    public void setInstanceAttributes(List<InstanceAttributeDTO> instanceAttributes) {
        this.instanceAttributes = instanceAttributes;
    }

    public List<PartUsageLinkDTO> getComponents() {
        return components;
    }

    public void setComponents(List<PartUsageLinkDTO> components) {
        this.components = components;
    }

    public List<DocumentIterationDTO> getLinkedDocuments() {
        return linkedDocuments;
    }

    public void setLinkedDocuments(List<DocumentIterationDTO> linkedDocuments) {
        this.linkedDocuments = linkedDocuments;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }
}
