import QuestionsPage from '../pages/QuestionsPage';
import QuestionPage from '../pages/QuestionPage';
import MyPostsPage from '../pages/MyPostsPage';
import NotFoundPage from '../pages/NotFoundPage';
import CreateQuestionPage from '../pages/CreateQuestionPage';
import EditQuestionPage from '../pages/EditQuestionPage';

const routes = [
    {
        path: '/',
        component: QuestionsPage,
        name: 'home'
    },
    {
        path: '/questions',
        component: QuestionsPage,
        name: 'questions'
    },
    {
        path: '/questions/create',
        component: CreateQuestionPage,
        name: 'questions.create'
    },
    {
        path: '/questions/:id/edit',
        component: EditQuestionPage,
        name: 'questions.edit'
    },
    {
        path: '/home', 
        component: MyPostsPage,
        name: 'my-posts',
        meta: {
          requiresAuth: true
        }
      },
    {
        path: '/questions/:slug',
        component: QuestionPage,
        name: 'questions.show',
        props: true
    },
    {
        path: '*',
        component: NotFoundPage,
    }
];

export default routes;