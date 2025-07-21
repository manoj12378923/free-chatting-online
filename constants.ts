import { User, Gender, Group } from './types';

export const MOCK_USERS: User[] = [
    { id: 'user-2', name: 'Sophia', age: 28, country: 'USA', city: 'New York', gender: Gender.FEMALE, avatarUrl: 'https://picsum.photos/id/1027/200/200', bio: 'Designer & Dreamer ✨', isOnline: true },
    { id: 'user-3', name: 'Liam', age: 31, country: 'Canada', city: 'Toronto', gender: Gender.MALE, avatarUrl: 'https://picsum.photos/id/1005/200/200', bio: 'Coffeeholic and Coder 💻', isOnline: true },
    { id: 'user-4', name: 'Olivia', age: 25, country: 'UK', city: 'London', gender: Gender.FEMALE, avatarUrl: 'https://picsum.photos/id/1011/200/200', bio: 'Traveling the world 🌍', isOnline: false },
    { id: 'user-5', name: 'Noah', age: 29, country: 'Australia', city: 'Sydney', gender: Gender.MALE, avatarUrl: 'https://picsum.photos/id/237/200/200', bio: 'Just a guy with a dog.', isOnline: true },
    { id: 'user-6', name: 'Ava', age: 30, country: 'USA', city: 'Chicago', gender: Gender.FEMALE, avatarUrl: 'https://picsum.photos/id/30/200/200', bio: 'Artist and cat lover 🎨', isOnline: false },
];

export const MOCK_GROUPS: Group[] = [
    {
        id: 'group-1',
        name: '🚀 Tech Lovers',
        description: 'All things tech, coding, and gadgets!',
        avatarUrl: 'https://picsum.photos/seed/tech/200/200',
        memberIds: ['user-3', 'user-5'],
    },
    {
        id: 'group-2',
        name: '🌍 World Travelers',
        description: 'Sharing travel stories and tips.',
        avatarUrl: 'https://picsum.photos/seed/travel/200/200',
        memberIds: ['user-4', 'user-5'],
    },
    {
        id: 'group-3',
        name: '🎬 Movie Buffs',
        description: 'Discussing the latest films and classics.',
        avatarUrl: 'https://picsum.photos/seed/movie/200/200',
        memberIds: ['user-2', 'user-4', 'user-6'],
    },
];

export const MOCK_GIFS: string[] = [
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3dweTJwYmRuaTNnM2Y5d2Z5bWp2dXVxN2J4bDNlZzRrcGZ0amU3MyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKSjRrfIPjeiVyE/giphy.gif',
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExejc1bmQxZmRuM2p1cjNqaG5uYWxlbXQ1b3hscXF1NnBvMHQ5ZDAydSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Q81NcsY6YxK7jxP4_s/giphy.gif',
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExenFud2Zoc2I3bXZ4d3RzZDRvOGtpaXhyNXQ1ZnF2a3FtdWlscW92aSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/5xtDarmwsuR9sDRObyU/giphy.gif',
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXQ2eGozcnh1eXhqNGJkM2R3NG1icTdybmR2eXN5d2QxbG1jaXNuMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o6Zt6fzS6qEbLh2r6/giphy.gif',
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaW1jajJjc2J2dmJsc2U0d3Vhc2F4dzhpbHF6eXl4dGNwYnF4ejQ3aiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26gsvAm8UPacJPsfS/giphy.gif',
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2F2cmk0ZzY5dDJqczl4aGFtaTZyM2JrcWFhbjc0dzloZGg5aG82aCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3q2wJsC2A9G_4pS8/giphy.gif',
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYXN5NXN5amV5N3kweDVlZzUwem1mMm00bGNuY3g2aDJrZ243aDc1OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o85xwxr06YNoFdSbm/giphy.gif',
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExajJzY2NjdXJ5c2Vtd25seGYzcWw1emM4amNqbGE1ZHRtNmpnemdoZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l41YmiCZ8y2eQ34wE/giphy.gif',
];