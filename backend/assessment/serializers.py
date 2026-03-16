from rest_framework import serializers
from .models import Assessment, StudyPlan
from content.models import LearningSection


class ChatMessageSerializer(serializers.Serializer):
    message = serializers.CharField()


class StudyPlanSerializer(serializers.ModelSerializer):
    sections_detail = serializers.SerializerMethodField()

    class Meta:
        model = StudyPlan
        fields = ['id', 'sections_ordered', 'sections_detail', 'total_price', 'status', 'created_at']

    def get_sections_detail(self, obj):
        sections = LearningSection.objects.filter(id__in=obj.sections_ordered)
        section_map = {s.id: s for s in sections}
        return [
            {
                'id': sid,
                'name': section_map[sid].name if sid in section_map else 'Unknown',
                'file_count': section_map[sid].files.count() if sid in section_map else 0,
                'price': float(section_map[sid].price_per_section) if sid in section_map else 0,
            }
            for sid in obj.sections_ordered
            if sid in section_map
        ]


class AssessmentSerializer(serializers.ModelSerializer):
    study_plan = StudyPlanSerializer(read_only=True)

    class Meta:
        model = Assessment
        fields = ['id', 'chat_history', 'generated_plan', 'is_finalized', 'created_at', 'study_plan']


class FinalizePlanSerializer(serializers.Serializer):
    sections_ordered = serializers.ListField(child=serializers.IntegerField())