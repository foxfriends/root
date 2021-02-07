use sqlx::postgres::PgConnection;

#[async_trait]
pub trait Loadable: Sized {
    async fn load(game: &str, conn: &mut PgConnection) -> sqlx::Result<Self>;
}
