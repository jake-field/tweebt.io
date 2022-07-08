export default interface Pagination {
	token?: string; //token used for next page
	newest_id?: string; //newest tweet id for scoped pulls
	oldest_id?: string; //oldest tweet id for scoped pulls
}