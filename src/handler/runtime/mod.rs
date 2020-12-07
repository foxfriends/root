use lumber::Lumber;

thread_local! {
    pub(super) static LUMBER: Lumber<'static> = Lumber::builder()
        .build_from_file("game/main.lumber")
        .unwrap();
}

#[cfg(test)]
#[test]
fn lumber_tests() {
    let result = Lumber::builder()
        .test(true)
        .build_from_file("game/main.lumber");

    if let Err(error) = result {
        println!("{}", error);
        assert!(false);
    }
}
