use lumber::Lumber;

thread_local! {
    pub(super) static LUMBER: Lumber<'static> = Lumber::builder()
        .build_from_file("game/main.lumber")
        .unwrap();
}
