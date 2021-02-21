use sqlx::postgres::PgConnection;

#[async_trait]
pub trait Deletable {
    async fn delete(game: &str, conn: &mut PgConnection) -> sqlx::Result<()>;
}
