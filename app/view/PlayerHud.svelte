<script>
  import { getFactionIconPath } from '../util/image';
  import Text from './component/Text.svelte';

  export let faction;
</script>

<div class='player'>
  <div class='identity'>
    <img class='icon' src={getFactionIconPath(faction.faction)} alt={faction.faction} />
    <div class='names'>
      <span class='name'>{faction.player}</span>
      <span class='faction'>
        <Text text={faction.faction} params={{ form: 'long' }}/>
      </span>
    </div>
  </div>
</div>

<style>
  .player {
    display: flex;
    flex-direction: column;
    margin: -24px;
    margin-bottom: 20px;
    overflow: hidden;
  }

  .identity {
    display: flex;
    align-items: center;
    flex-direction: row;
    flex-wrap: no-wrap;
    gap: 16px;
  }

  .icon {
    width: 60px;
    height: 60px;
  }

  .names {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;

    & .name {
      font-family: var(--font-family--display);
      font-size: 20px;
      font-weight: 400;
    }

    & .faction {
      font-size: 14px;
    }

    & .name,
    & .faction {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
</style>
