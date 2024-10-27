package internal

func Paginate[T any](data []T, page, limit int) []T {
	start := (page - 1) * limit
	if start > len(data) {
		return []T{}
	}
	end := start + limit
	if end > len(data) {
		end = len(data)
	}
	return data[start:end]
}

func CalculateTotalPages(items int, limit int) int {
	return (items + limit - 1) / limit
}
