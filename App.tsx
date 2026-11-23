import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import type { ComponentRef } from 'react';
import { BackHandler, Pressable, ScrollView, Text, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { buildProfile, defaultDemo, initialLooks, initialPieces, matchOutfit, sampleLook, samplePiece } from './src/model';
import type { Category, Piece } from './src/model';
import { DemoProgress, tasks } from './src/motion';
import type { Task } from './src/motion';
import { Closet, Library, Outfits, Primary, StyleProfile } from './src/screens';
import { LookLinkForm, MatchReasons, PieceDetails, Sheet, SheetOption, StyleCues } from './src/sheets';
import { colors, s } from './src/theme';

const tabs = [
  { id: 'library', label: 'Library', icon: 'albums-outline' },
  { id: 'profile', label: 'Profile', icon: 'finger-print-outline' },
  { id: 'closet', label: 'Closet', icon: 'shirt-outline' },
  { id: 'outfits', label: 'Outfits', icon: 'sparkles-outline' },
] as const;

type Tab = (typeof tabs)[number]['id'];
type SheetState =
  | { type: 'link' | 'cues' | 'match' | 'reset' }
  | { type: 'piece'; piece: Piece }
  | { type: 'progress'; task: Task; media: ImageSourcePropType[]; complete: () => void };

function Studio() {
  const { bottom } = useSafeAreaInsets();
  const [demo, setDemo] = useState(defaultDemo);
  const [tab, setTab] = useState<Tab>('library');
  const [sheet, setSheet] = useState<SheetState | null>(null);
  const [filter, setFilter] = useState<'All' | Category>('All');
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const looks = demo.lookLink ? [...initialLooks, { ...sampleLook, source: demo.lookLink }] : initialLooks;
  const closet = demo.pieceAdded ? [samplePiece, ...initialPieces] : initialPieces;
  const selected = looks.filter(look => demo.selectedIds.includes(look.id));
  const originalProfile = buildProfile(selected, false);
  const casualProfile = buildProfile(selected, true);
  const originalOutfit = originalProfile ? matchOutfit(originalProfile, closet) : undefined;
  const casualOutfit = originalOutfit && casualProfile
    ? matchOutfit(casualProfile, closet, originalOutfit.id)
    : undefined;
  const casualApplied = demo.prefersCasual && Boolean(casualOutfit);
  const profile = casualApplied ? casualProfile : originalProfile;
  const outfit = casualApplied ? casualOutfit : originalOutfit;
  const casualAction = originalOutfit?.traits.formality === 'Casual' ? 'Try another casual outfit' : 'Make it more casual';

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (tab === 'library') return false;
      setTab('library');
      return true;
    });
    return () => subscription.remove();
  }, [tab]);

  function goTo(next: Tab) {
    if (next === 'closet' && tab !== 'closet') setFilter('All');
    if (next === tab) scroll.current?.scrollTo({ y: 0, animated: true });
    setTab(next);
  }

  function toggleLook(id: string) {
    setDemo(current => ({
      ...current,
      selectedIds: current.selectedIds.includes(id)
        ? current.selectedIds.filter(selectedId => selectedId !== id)
        : [...current.selectedIds, id],
    }));
  }

  function run(task: Task, media: ImageSourcePropType[], apply: () => void) {
    setSheet({
      type: 'progress',
      task,
      media,
      complete: () => {
        apply();
        setSheet(null);
      },
    });
  }

  function addLook(source: URL) {
    run('importLook', [sampleLook.image], () => {
      setDemo(current => current.lookLink ? current : {
        ...current,
        lookLink: source,
        selectedIds: [...current.selectedIds, sampleLook.id],
      });
      scroll.current?.scrollTo({ y: 0 });
    });
  }

  function addPiece() {
    run('addPiece', [samplePiece.image], () => {
      setDemo(current => current.pieceAdded ? current : { ...current, pieceAdded: true });
      setFilter('All');
      scroll.current?.scrollTo({ y: 0 });
    });
  }

  function buildStyleProfile() {
    run('buildProfile', selected.slice(0, 3).map(look => look.image), () => goTo('profile'));
  }

  function generateOutfit() {
    if (!profile) {
      goTo('library');
      return;
    }
    run('generateOutfit', closet.slice(0, 3).map(piece => piece.image), () => goTo('outfits'));
  }

  function togglePreference() {
    if (!outfit) return;
    run('updateOutfit', outfit.pieces.slice(0, 3).map(piece => piece.image), () => {
      setDemo(current => ({ ...current, prefersCasual: !current.prefersCasual }));
      scroll.current?.scrollTo({ y: 0 });
    });
  }

  function resetDemo() {
    setDemo(defaultDemo);
    goTo('library');
    setSheet(null);
  }

  const action = (() => {
    switch (tab) {
      case 'library':
        return <Primary title="Build my style profile" disabled={!selected.length} onPress={buildStyleProfile} />;
      case 'profile':
        return profile && <Primary title="See my closet" icon="shirt-outline" onPress={() => goTo('closet')} />;
      case 'closet':
        return <Primary title={profile ? 'Generate outfits' : 'Choose inspiration'} icon="sparkles-outline" onPress={generateOutfit} />;
      case 'outfits':
        return casualOutfit && (
          <Primary title={casualApplied ? 'Restore original match' : casualAction}
            icon={casualApplied ? 'refresh-outline' : 'swap-horizontal'} onPress={togglePreference} />
        );
    }
  })();

  return (
    <SafeAreaView style={s.safe} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <View style={s.frame}>
        <View style={s.header}>
          <View style={s.brandGroup} accessibilityLabel="STYLEECHO">
            <View style={s.brandMark}><Ionicons aria-hidden name="sparkles" size={16} color={colors.white} /></View>
            <Text style={s.brand}>STYLEECHO</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Demo options" style={s.iconButton}
            onPress={() => setSheet({ type: 'reset' })}>
            <Ionicons aria-hidden name="ellipsis-horizontal" size={20} color={colors.wine} />
          </Pressable>
        </View>
        <ScrollView key={tab} ref={scroll} style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
          {tab === 'library' && <Library looks={looks} selectedIds={demo.selectedIds}
            toggle={toggleLook} add={() => setSheet({ type: 'link' })} showCues={() => setSheet({ type: 'cues' })} />}
          {tab === 'profile' && <StyleProfile selected={selected} profile={profile} edit={() => goTo('library')} />}
          {tab === 'closet' && <Closet pieces={closet} filter={filter} setFilter={setFilter} added={demo.pieceAdded}
            add={addPiece} showPiece={piece => setSheet({ type: 'piece', piece })} />}
          {tab === 'outfits' && <Outfits outfit={outfit} prefersCasual={casualApplied} edit={() => goTo('library')}
            showReasons={() => setSheet({ type: 'match' })} openPiece={piece => setSheet({ type: 'piece', piece })} />}
        </ScrollView>
        {action && <View style={s.actionBar}>{action}</View>}
        <View accessibilityRole="tablist" style={[s.tabs, { paddingBottom: Math.max(bottom, 5) }]}>
          {tabs.map(item => (
            <Pressable key={item.id} accessibilityRole="tab" aria-selected={tab === item.id}
              style={s.tab} onPress={() => goTo(item.id)}>
              <View style={[s.tabIcon, tab === item.id && s.tabIconActive]}>
                <Ionicons aria-hidden name={item.icon} size={19} color={tab === item.id ? colors.wine : colors.muted} />
              </View>
              <Text style={[s.tabLabel, tab === item.id && s.tabActive]}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      {sheet && (
        <Sheet title={sheet.type === 'piece' ? sheet.piece.name : sheet.type === 'progress' ? tasks[sheet.task].title : {
          link: 'Add an outfit link',
          cues: 'The four style cues',
          match: 'Why it matches',
          reset: 'Demo options',
        }[sheet.type]} bottom={bottom} close={() => setSheet(null)}>
          {sheet.type === 'link' && <LookLinkForm submit={addLook} />}
          {sheet.type === 'progress' && <DemoProgress key={sheet.task} task={sheet.task} media={sheet.media} complete={sheet.complete} />}
          {sheet.type === 'cues' && <StyleCues />}
          {sheet.type === 'match' && outfit && <MatchReasons outfit={outfit} />}
          {sheet.type === 'piece' && <PieceDetails piece={sheet.piece} />}
          {sheet.type === 'reset' && <>
            <Text style={s.body}>Restore the starting looks, closet, and preferences for another take.</Text>
            <SheetOption icon="refresh-outline" title="Reset demo" onPress={resetDemo} />
          </>}
        </Sheet>
      )}
    </SafeAreaView>
  );
}

export default function App() {
  return <SafeAreaProvider><Studio /></SafeAreaProvider>;
}
