export interface Project {
    _id: string;
    title: string;
    year: string;
    fromMonth: string;
    company: string;
    description: string;
    url: string;
    images: string[];
}

export  interface Experience {
    _id: string;
    title: string;
    from: string;
    fromMonth: string;
    to: string;
    toMonth: string;
    company: string;
    location: string;
    url: string;
    description: string;
    images: string[];
}

export  interface Award {
    _id: string;
    title: string;
    year: string;
    presentedBy: string;
    url: string;
    description: string;
}

export  interface Certification {
    _id: string;
    title: string;
    issued: string;
    expires: string;
    organization: string;
    url: string;
    description: string;
}

export  interface Education {
    _id: string;
    title: string;
    from: string;
    to: string;
    institution: string;
    fieldOfStudy: string;
    gpa: string;
    url: string;
    description: string;
}

export  interface Volunteer {
    _id: string;
    title: string;
    from: string;
    fromMonth: string;
    to: string;
    toMonth: string;
    organization: string;
    url: string;
    description: string;
    images: string[];
}

export interface ViewHistory {
    month: string;
    count: number;
    timestamp: string;
}

export  interface Profile {
    _id: string;
    private: boolean;
    username: string;
    title: string;
    country: string;
    bio: string;
    email: string;
    image: string;
    website: string;
    linkedIn: string;
    github: string;
    project: Project[];
    experience: Experience[];
    award: Award[];
    certification: Certification[];
    education: Education[];
    volunteer: Volunteer[];
    viewCount: number;
    viewHistory: ViewHistory[];
}