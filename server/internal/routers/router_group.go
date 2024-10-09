package routers

import "backend/internal/routers/user"

type RouterGroup struct {
	User *user.UserRouter
}

var AllRouterGroup = &RouterGroup{
	User: &user.UserRouter{},
}
