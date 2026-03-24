export const buildStudentsUrl = (searchParams) => {
    const params = new URLSearchParams();

    params.set("page", searchParams.get("page") || 1);

    const keyword = searchParams.get("keyword");
    const grade = searchParams.get("grade");
    const sort = searchParams.get("sort");

    if (keyword) params.set("keyword", keyword);
    if (grade) params.set("grade", grade);
    if (sort) params.set("sort", sort);

    return `/student/getStudents?${params.toString()}`;
};
export const buildGroupsUrl = (searchParams) => {
    const params = new URLSearchParams();

    params.set("page", searchParams.get("page") || 1);

    const keyword = searchParams.get("keyword");
    const grade = searchParams.get("grade");
    const sort = searchParams.get("sort");

    if (keyword) params.set("keyword", keyword);
    if (grade) params.set("grade", grade);
    if (sort) params.set("sort", sort);

    return `/group/getGroupsByTeacher?${params.toString()}`;
};
export const buildSessionUrl = (searchParams) => {
    const params = new URLSearchParams();

    params.set("page", searchParams.get("page") || 1);

    const keyword = searchParams.get("keyword");
    const grade = searchParams.get("grade");
    const sort = searchParams.get("sort");

    if (keyword) params.set("keyword", keyword);
    if (grade) params.set("grade", grade);
    if (sort) params.set("sort", sort);

    return `/session/getSessionsTeacher?${params.toString()}`;
};
