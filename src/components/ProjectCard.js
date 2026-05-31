import { Pressable, Text, View } from 'react-native';

export default function ProjectCard({ project, colors, onPress, onDelete }) {
  const progress = project.task_count ? Math.round((project.completed_count / project.task_count) * 100) : 0;

  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 24,
        padding: 18,
        marginBottom: 14,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: '900' }}>{project.title}</Text>
          <Text style={{ color: colors.muted, marginTop: 6, lineHeight: 20 }} numberOfLines={2}>
            {project.description || 'No description added yet.'}
          </Text>
        </View>
        <Pressable onPress={onDelete} hitSlop={10}>
          <Text style={{ color: colors.danger, fontWeight: '800' }}>Delete</Text>
        </Pressable>
      </View>

      <View style={{ marginTop: 18 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: colors.muted }}>{project.completed_count}/{project.task_count} done</Text>
          <Text style={{ color: colors.primary, fontWeight: '800' }}>{progress}%</Text>
        </View>
        <View style={{ height: 9, backgroundColor: colors.primarySoft, borderRadius: 20, marginTop: 8 }}>
          <View style={{ width: `${progress}%`, height: 9, backgroundColor: colors.primary, borderRadius: 20 }} />
        </View>
      </View>
    </Pressable>
  );
}
