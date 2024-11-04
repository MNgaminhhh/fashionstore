package banner

import (
	"backend/internal/middleware"
	"backend/internal/wire"
	"github.com/labstack/echo"
)

type BannerRouter struct {
}

func (br *BannerRouter) InitBannerRouter(router *echo.Group) {
	bannersController, _ := wire.InitBannerRouterHandler()
	bannerRouter := router.Group("/banners")
	{
		bannerRouter.POST("", bannersController.AddBanner, middleware.JWTMiddleware)

		bannerRouter.GET("/active", bannersController.GetActiveBanners)
		bannerRouter.GET("", bannersController.GetAllBanners)

		bannerRouter.PUT("/:id", bannersController.UpdateBanner, middleware.JWTMiddleware)
	}
}
